import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  FaCloudUploadAlt,
  FaImages,
  FaVideo,
  FaTrash,
} from "react-icons/fa";
import axiosInstance from "../../config/axios";
import { getAllEventByFilter } from "../../app/event/eventThunk";
import { getEventCategoryByFilter } from "../../app/category/categoryThunk";
import { getSubCategoryByFilter } from "../../app/subcategory/subcategoryThunk";

const AdminMedia = () => {
  const dispatch = useDispatch();
  const { eventCategories = [] } = useSelector(
    (state) => state.eventCategory
  );
  const { subCategories = [] } = useSelector(
    (state) => state.subCategory
  );
  const { events = [] } = useSelector((state) => state.event);

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formState, setFormState] = useState({
    categoryId: "",
    subCategoryId: "",
    eventId: "",
    isDownloadable: "disabled",
  });

  useEffect(() => {
    dispatch(
      getEventCategoryByFilter({
        page: 1,
        limit: 100,
      })
    );

    dispatch(
      getAllEventByFilter({
        page: 1,
        limit: 100,
      })
    );
  }, [dispatch]);

  useEffect(() => {
    if (!formState.categoryId) return;

    dispatch(
      getSubCategoryByFilter({
        categoryId: formState.categoryId,
        page: 1,
        limit: 100,
      })
    );
  }, [dispatch, formState.categoryId]);

  useEffect(() => {
    if (!formState.subCategoryId) return;

    dispatch(
      getAllEventByFilter({
        eventSubCategoryId: formState.subCategoryId,
        page: 1,
        limit: 100,
      })
    );
  }, [dispatch, formState.subCategoryId]);

  useEffect(() => {
    if (!formState.eventId || events.length === 0) return;

    const selectedEvent = events.find(
      (event) => event._id === formState.eventId
    );

    if (!selectedEvent?.eventSubCategoryId?._id) return;

    const categoryId =
      selectedEvent.eventSubCategoryId.categoryId?._id || "";
    const subCategoryId = selectedEvent.eventSubCategoryId._id;

    setFormState((prev) => ({
      ...prev,
      categoryId,
      subCategoryId,
    }));

    if (categoryId) {
      dispatch(
        getSubCategoryByFilter({
          categoryId,
          page: 1,
          limit: 100,
        })
      );
    }
  }, [dispatch, events, formState.eventId]);

  const handleSelectChange = (e) => {
    const { name, value } = e.target;

    setFormState((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "categoryId" && {
        subCategoryId: "",
        eventId: "",
      }),
      ...(name === "subCategoryId" && {
        eventId: "",
      }),
    }));
  };

  const handleChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    const previewFiles = selectedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      type: file.type.startsWith("image") ? "image" : "video",
    }));

    setFiles((prev) => [...prev, ...previewFiles]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (!formState.eventId) {
      return toast.error("Please select an event");
    }

    if (files.length === 0) {
      return toast.error("Please select at least one file");
    }

    const formData = new FormData();
    formData.append("eventId", formState.eventId);
    formData.append(
      "isDownloadable",
      formState.isDownloadable === "enabled"
    );

    files.forEach((item) => {
      formData.append("mediaFiles", item.file);
    });

    try {
      setLoading(true);
      setUploadProgress(0);

      const response = await axiosInstance.post(
        "/admin/createMedia",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (event) => {
            const percent = Math.round(
              (event.loaded * 100) / event.total
            );
            setUploadProgress(percent);
          },
        }
      );

      toast.success(response.data.message || "Upload successful");
      setFiles([]);
      setUploadProgress(0);
      setFormState({
        categoryId: "",
        subCategoryId: "",
        eventId: "",
        isDownloadable: "disabled",
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Upload failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Upload Media</h1>
        <p className="text-gray-500 mt-2">
          Upload images & videos for an event.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow p-6">
        <div className="grid md:grid-cols-2 gap-5">

          <div>
            <label className="font-semibold">Event Person</label>
            <select
              name="eventId"
              value={formState.eventId}
              onChange={handleSelectChange}
              className="w-full border rounded-xl p-3 mt-2"
            >
              <option value="">Select Event</option>
              {events.length === 0 ? (
                <option value="">No events available</option>
              ) : (
                events.map((event) => {
                  const eventLabel = event.brideName || event.groomName
                    ? `${event.brideName || ""} ${event.groomName || ""}`.trim()
                    : event.location || event._id;

                  return (
                    <option key={event._id} value={event._id}>
                      {eventLabel}
                    </option>
                  );
                })
              )}
            </select>
          </div>
          <div>
            <label className="font-semibold">Category</label>
            <select
              name="categoryId"
              value={formState.categoryId}
              onChange={handleSelectChange}
              className="w-full border rounded-xl p-3 mt-2"
            >
              <option value="">Select Category</option>
              {eventCategories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-semibold">Sub Category</label>
            <select
              name="subCategoryId"
              value={formState.subCategoryId}
              onChange={handleSelectChange}
              className="w-full border rounded-xl p-3 mt-2"
            >
              <option value="">Select Sub Category</option>
              {subCategories.map((subCategory) => (
                <option key={subCategory._id} value={subCategory._id}>
                  {subCategory.name}
                </option>
              ))}
            </select>
          </div>


          <div>
            <label className="font-semibold">
              Download Permission
            </label>
            <select
              name="isDownloadable"
              value={formState.isDownloadable}
              onChange={handleSelectChange}
              className="w-full border rounded-xl p-3 mt-2"
            >
              <option value="disabled">Disabled</option>
              <option value="enabled">Enabled</option>
            </select>
          </div>
        </div>
      </div>

      <label className="border-2 border-dashed border-purple-300 rounded-2xl bg-white p-10 flex flex-col items-center justify-center cursor-pointer hover:border-purple-600 transition">
        <FaCloudUploadAlt className="text-6xl text-purple-600" />
        <h2 className="text-2xl font-bold mt-4">
          Drag & Drop Files
        </h2>
        <p className="text-gray-500 mt-2">
          Upload Multiple Images & Videos
        </p>
        <input
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleChange}
          className="hidden"
        />
      </label>

      {files.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-5">
            Selected Files
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {files.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow overflow-hidden"
              >
                {item.type === "image" ? (
                  <img
                    src={item.preview}
                    className="w-full h-52 object-cover"
                  />
                ) : (
                  <video
                    src={item.preview}
                    className="w-full h-52 object-cover"
                    controls
                  />
                )}
                <div className="p-4">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      {item.type === "image" ? (
                        <FaImages className="text-blue-600" />
                      ) : (
                        <FaVideo className="text-red-600" />
                      )}
                      {item.type}
                    </span>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-red-500"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {(loading || uploadProgress > 0) && (
        <div className="bg-white rounded-2xl shadow p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Upload Progress</span>
            <span className="text-sm text-gray-500">
              {uploadProgress}% 
            </span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-600 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={handleUpload}
          disabled={loading}
          className={`px-8 py-3 rounded-xl font-semibold text-white ${
            loading
              ? "bg-purple-400 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700"
          }`}
        >
          {loading ? "Uploading..." : "Upload Media"}
        </button>
      </div>
    </div>
  );
};

export default AdminMedia;