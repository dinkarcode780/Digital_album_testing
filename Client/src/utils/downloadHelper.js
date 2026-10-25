const DOWNLOADS_STORAGE_KEY_PREFIX = "digital_album_downloads";

const getDownloadsStorageKey = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const userId = user?._id || user?.id || user?.email;
    const token = localStorage.getItem("userToken");
    const identity = userId || token || "anonymous";

    return `${DOWNLOADS_STORAGE_KEY_PREFIX}_${identity}`;
  } catch (error) {
    return `${DOWNLOADS_STORAGE_KEY_PREFIX}_anonymous`;
  }
};

/**
 * Get all downloaded items from local storage (100% dynamic, no fake/seed data)
 */
export const getDownloads = () => {
  try {
    const storageKey = getDownloadsStorageKey();
    const data = localStorage.getItem(storageKey);
    if (!data) {
      return [];
    }
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) return [];

    // Filter out any legacy mock seed data if present in localStorage
    const realDownloads = parsed.filter(
      (item) =>
        item &&
        !String(item.id || "").startsWith("seed-") &&
        !String(item.mediaId || "").startsWith("seed-media-")
    );

    if (realDownloads.length !== parsed.length) {
      localStorage.setItem(storageKey, JSON.stringify(realDownloads));
    }

    return realDownloads;
  } catch (error) {
    console.error("Error reading downloads from localStorage:", error);
    return [];
  }
};

/**
 * Save / Record a downloaded media item
 */
export const recordDownload = (item) => {
  if (!item || !item.url) return;

  try {
    const existing = getDownloads();
    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    const isVideo =
      item.type === "Video" ||
      item.videosOrImageUrlType === "Video" ||
      /\.(mp4|webm|mov|avi|mkv)$/i.test(item.url);

    const newRecord = {
      id: item.id || `dl_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      mediaId: item.mediaId || item._id || item.id || `media_${Date.now()}`,
      title: item.title || item.eventTitle || (isVideo ? "Video Download" : "Photo Download"),
      albumTitle: item.albumTitle || item.eventTitle || "Digital Album",
      type: isVideo ? "Video" : "Image",
      date: item.date || formattedDate,
      timestamp: Date.now(),
      size: item.size || (isVideo ? "75 MB" : "3.5 MB"),
      url: item.url,
      thumbnail: item.thumbnail || item.url,
      eventId: item.eventId || null,
    };

    // Remove older duplicate with the exact same URL or mediaId to put recent one on top
    const filtered = existing.filter(
      (entry) => entry.url !== newRecord.url && entry.mediaId !== newRecord.mediaId
    );

    const updated = [newRecord, ...filtered];
    localStorage.setItem(getDownloadsStorageKey(), JSON.stringify(updated));

    // Dispatch update event
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("downloads_updated", { detail: updated })
      );
    }

    return newRecord;
  } catch (error) {
    console.error("Error recording download:", error);
  }
};

/**
 * Remove a single download item from history
 */
export const removeDownload = (id) => {
  try {
    const existing = getDownloads();
    const updated = existing.filter((item) => item.id !== id);
    localStorage.setItem(getDownloadsStorageKey(), JSON.stringify(updated));

    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("downloads_updated", { detail: updated })
      );
    }
    return true;
  } catch (error) {
    console.error("Error removing download:", error);
    return false;
  }
};

/**
 * Clear all downloaded items from history
 */
export const clearAllDownloads = () => {
  try {
    localStorage.setItem(getDownloadsStorageKey(), JSON.stringify([]));
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("downloads_updated", { detail: [] })
      );
    }
    return true;
  } catch (error) {
    console.error("Error clearing downloads:", error);
    return false;
  }
};

/**
 * Downloads a media file directly without opening a new tab (even for cross-origin URLs like Cloudinary).
 * Also records download into history if metadata is provided or extracted.
 * @param {string} url - The URL of the image or video to download
 * @param {string} filename
 * @param {object} meta - Optional metadata to record in downloads history
 */
export const downloadDirectMedia = async (url, filename = "download", meta = null) => {
  if (!url) return;

  // Record download in local history
  if (meta) {
    recordDownload({ ...meta, url: url || meta.url });
  } else {
    recordDownload({
      url,
      title: filename || "Downloaded Media",
      type: /\.(mp4|webm|mov|avi)$/i.test(url) ? "Video" : "Image",
    });
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      mode: "cors",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch media: ${response.statusText}`);
    }

    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    // Determine extension from content-type or URL
    let ext = "";
    if (blob.type) {
      if (blob.type.includes("jpeg") || blob.type.includes("jpg")) ext = ".jpg";
      else if (blob.type.includes("png")) ext = ".png";
      else if (blob.type.includes("webp")) ext = ".webp";
      else if (blob.type.includes("mp4")) ext = ".mp4";
      else if (blob.type.includes("webm")) ext = ".webm";
      else if (blob.type.includes("quicktime")) ext = ".mov";
    }

    if (!ext) {
      const match = url.split("?")[0].split("#")[0].match(/\.([a-zA-Z0-9]+)$/);
      ext = match ? `.${match[1]}` : ".jpg";
    }

    const cleanFilename = filename.replace(/\.[^/.]+$/, "");
    const finalFilename = `${cleanFilename}${ext}`;

    const link = document.createElement("a");
    link.style.display = "none";
    link.href = blobUrl;
    link.download = finalFilename;
    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    }, 100);
  } catch (error) {
    console.warn("Direct blob download failed, using Cloudinary attachment fallback:", error);

    // Fallback: If Cloudinary, inject fl_attachment transformation to force download headers
    let downloadUrl = url;
    if (url.includes("cloudinary.com") && url.includes("/upload/")) {
      downloadUrl = url.replace("/upload/", "/upload/fl_attachment/");
    }

    const link = document.createElement("a");
    link.style.display = "none";
    link.href = downloadUrl;
    link.download = filename || "download";
    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      document.body.removeChild(link);
    }, 100);
  }
};
