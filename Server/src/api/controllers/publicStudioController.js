import asyncHandler from "../../utils/asyncHandler.js";
import User from "../../models/userModel.js";
import StudioProfile from "../../models/studioProfileModel.js";
import Service from "../../models/servicesModel.js";
import Blog from "../../models/blogModel.js";
import Testimonial from "../../models/testimonialModel.js";
import Event from "../../models/eventModel.js";

// Helper: Ensure default StudioProfile exists for an Admin
export const getOrCreateStudioProfile = async (admin) => {
  let profile = await StudioProfile.findOne({ adminId: admin._id });
  if (!profile) {
    // Generate default sample showcase albums
    const defaultShowcaseAlbums = [
      {
        title: "Royal Wedding Highlights",
        category: "Wedding",
        coverImage: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80",
        description: "A grand destination wedding filled with royal traditions and unforgettable emotions.",
        mediaUrls: [
          "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1000&q=80",
        ],
      },
      {
        title: "Sunset Pre-Wedding Romance",
        category: "Pre-Wedding",
        coverImage: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1000&q=80",
        description: "Cinematic pre-wedding photoshoot captured during golden sunset hours.",
        mediaUrls: [
          "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1000&q=80",
        ],
      },
      {
        title: "Traditional Sangeet & Mehendi Night",
        category: "Ceremony",
        coverImage: "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1000&q=80",
        description: "Vibrant colors, dance performances and candid moments from the sangeet night.",
        mediaUrls: [
          "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&w=1000&q=80",
        ],
      },
    ];

    profile = await StudioProfile.create({
      adminId: admin._id,
      studioName: admin.name ? `${admin.name} Studio` : "Studio Photography",
      tagline: "Professional Wedding & Event Photography Studio",
      aboutBio: `${admin.name || "Our Studio"} is a premier photography and cinematic film studio with over 5+ years of experience in capturing timeless wedding memories.`,
      logo: admin.profileImage || "",
      coverBanner: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80",
      email: admin.email || "",
      phoneNumber: admin.phoneNumber ? String(admin.phoneNumber) : "",
      whatsappNumber: admin.phoneNumber ? String(admin.phoneNumber) : "",
      address: admin.address || "Studio Location",
      city: "Delhi NCR",
      experienceYears: 6,
      eventsCompleted: 220,
      pricingStartingFrom: 25000,
      showcaseAlbums: defaultShowcaseAlbums,
      isPublic: true,
    });

    // Also seed default sample services & testimonials if none exist
    const serviceCount = await Service.countDocuments({ createdBy: admin._id });
    if (serviceCount === 0) {
      await Service.create([
        {
          title: "Complete Wedding Photography Package",
          description: "Full-day wedding photography coverage including candid moments, traditional portraits, and high-res digital albums.",
          price: 45000,
          features: ["2 Senior Candid Photographers", "1 Traditional Photographer", "Full Day Coverage", "Unlimited High-Res Digital Delivery", "Client Web Gallery"],
          icon: "FaCamera",
          createdBy: admin._id,
          adminId: admin._id,
        },
        {
          title: "Cinematic Pre-Wedding Shoot",
          description: "4-6 hours outdoor pre-wedding couple shoot with teaser video, styled outfits and drone coverage.",
          price: 25000,
          features: ["1 Cinematographer + 1 Photographer", "4K Teaser Video (2-3 mins)", "30 Edited High-Res Portraits", "Drone Aerial Shots Included"],
          icon: "FaVideo",
          createdBy: admin._id,
          adminId: admin._id,
        },
        {
          title: "Engagement & Sangeet Coverage",
          description: "Dedicated coverage for ring ceremony, sangeet performances, and family celebrations.",
          price: 20000,
          features: ["Full Event Coverage", "High-Speed Album Delivery", "Instant Guest QR Code Sharing"],
          icon: "FaGem",
          createdBy: admin._id,
          adminId: admin._id,
        },
      ]);
    }

    const testCount = await Testimonial.countDocuments({ adminId: admin._id });
    if (testCount === 0) {
      await Testimonial.create([
        {
          adminId: admin._id,
          clientName: "Rohit & Ananya Sharma",
          clientRole: "Wedding Couple",
          rating: 5,
          feedback: "The entire team was phenomenal! They captured every single emotional moment of our wedding so beautifully. Our family loved the digital album!",
          eventName: "Destination Wedding in Jaipur",
        },
        {
          adminId: admin._id,
          clientName: "Vikram & Pooja Verma",
          clientRole: "Pre-Wedding Client",
          rating: 5,
          feedback: "Our pre-wedding teaser felt like a Bollywood movie! High level of professionalism and very fast turnaround time.",
          eventName: "Udaipur Pre-Wedding Shoot",
        },
      ]);
    }
  }
  return profile;
};

// ==========================================
// 1. PUBLIC STUDIOS DIRECTORY
// ==========================================

export const listPublicStudios = asyncHandler(async (req, res) => {
  const { search, city, specialty, sortBy = "featured" } = req.query;

  // Find all active admins
  const admins = await User.find({ userType: "Admin", isActive: true }).select(
    "name email phoneNumber address profileImage createdAt"
  );

  // Ensure every admin has a profile and fetch them
  const studiosList = await Promise.all(
    admins.map(async (adm) => {
      const profile = await getOrCreateStudioProfile(adm);
      if (!profile.isPublic) return null;

      const servicesCount = await Service.countDocuments({
        $or: [{ createdBy: adm._id }, { adminId: adm._id }],
        isActive: true,
      });

      const blogsCount = await Blog.countDocuments({
        createdBy: adm._id,
        isPublished: true,
      });

      const testimonialsCount = await Testimonial.countDocuments({
        adminId: adm._id,
        isActive: true,
      });

      return {
        _id: profile._id,
        adminId: adm._id,
        studioName: profile.studioName || adm.name,
        tagline: profile.tagline,
        aboutBio: profile.aboutBio,
        logo: profile.logo || adm.profileImage,
        coverBanner: profile.coverBanner,
        city: profile.city || "Delhi NCR",
        state: profile.state,
        address: profile.address || adm.address,
        phoneNumber: profile.phoneNumber || adm.phoneNumber,
        whatsappNumber: profile.whatsappNumber || adm.phoneNumber,
        email: profile.email || adm.email,
        experienceYears: profile.experienceYears || 5,
        eventsCompleted: profile.eventsCompleted || 100,
        specialties: profile.specialties || ["Wedding", "Pre-Wedding"],
        pricingStartingFrom: profile.pricingStartingFrom || 25000,
        rating: profile.rating || 4.9,
        reviewCount: profile.reviewCount || 20,
        isFeatured: Boolean(profile.isFeatured),
        demoAlbumsCount: (profile.showcaseAlbums || []).length,
        servicesCount,
        blogsCount,
        testimonialsCount,
        sampleAlbumCover:
          profile.showcaseAlbums?.[0]?.coverImage || profile.coverBanner,
        showcaseAlbums: profile.showcaseAlbums || [],
      };
    })
  );

  let filtered = studiosList.filter(Boolean);

  // Search filter
  if (search) {
    const q = search.toLowerCase().trim();
    filtered = filtered.filter(
      (s) =>
        s.studioName?.toLowerCase().includes(q) ||
        s.city?.toLowerCase().includes(q) ||
        s.tagline?.toLowerCase().includes(q) ||
        s.address?.toLowerCase().includes(q) ||
        (s.specialties && s.specialties.some((spec) => spec.toLowerCase().includes(q)))
    );
  }

  // City filter
  if (city && city !== "All") {
    filtered = filtered.filter((s) => s.city?.toLowerCase() === city.toLowerCase());
  }

  // Specialty filter
  if (specialty && specialty !== "All") {
    filtered = filtered.filter(
      (s) => s.specialties && s.specialties.some((spec) => spec.toLowerCase().includes(specialty.toLowerCase()))
    );
  }

  // Sort
  if (sortBy === "featured") {
    filtered.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
  } else if (sortBy === "rating") {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === "price_low") {
    filtered.sort((a, b) => a.pricingStartingFrom - b.pricingStartingFrom);
  } else if (sortBy === "experience") {
    filtered.sort((a, b) => b.experienceYears - a.experienceYears);
  }

  // Extract distinct cities & specialties for UI filters
  const allCities = Array.from(new Set(studiosList.filter(Boolean).map((s) => s.city).filter(Boolean)));
  const allSpecialties = Array.from(
    new Set(studiosList.filter(Boolean).flatMap((s) => s.specialties || []).filter(Boolean))
  );

  res.status(200).json({
    success: true,
    data: {
      studios: filtered,
      totalCount: filtered.length,
      filterOptions: {
        cities: allCities,
        specialties: allSpecialties,
      },
    },
  });
});

// ==========================================
// 2. PUBLIC STUDIO SHOWCASE / PROFILE DETAILS
// ==========================================

export const getPublicStudioDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;

  let profile = await StudioProfile.findOne({
    $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { adminId: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
  }).populate("adminId", "name email phoneNumber address profileImage createdAt");

  // Fallback: If passed adminId directly
  if (!profile) {
    const admin = await User.findOne({ _id: id, userType: "Admin" });
    if (admin) {
      profile = await getOrCreateStudioProfile(admin);
      profile = await StudioProfile.findById(profile._id).populate(
        "adminId",
        "name email phoneNumber address profileImage createdAt"
      );
    }
  }

  if (!profile) {
    return res.status(404).json({ success: false, message: "Studio profile not found" });
  }

  const adminId = profile.adminId?._id || profile.adminId;

  // Fetch Services, Blogs, Testimonials
  const [services, blogs, testimonials] = await Promise.all([
    Service.find({ $or: [{ createdBy: adminId }, { adminId }], isActive: true }).sort({ price: 1 }),
    Blog.find({ createdBy: adminId, isPublished: true }).sort({ createdAt: -1 }),
    Testimonial.find({ adminId, isActive: true }).sort({ createdAt: -1 }),
  ]);

  res.status(200).json({
    success: true,
    data: {
      studio: profile,
      services,
      blogs,
      testimonials,
    },
  });
});

// ==========================================
// 3. PUBLIC BOOKING INQUIRY
// ==========================================

export const submitPublicBookingInquiry = asyncHandler(async (req, res) => {
  const {
    adminId,
    clientName,
    clientEmail,
    clientPhone,
    eventType,
    eventDate,
    eventEndDate,
    location,
    notes,
    serviceId,
  } = req.body;

  if (!adminId || !clientName || !clientPhone || !eventDate) {
    return res.status(400).json({
      success: false,
      message: "Studio ID, client name, phone number, and event date are required",
    });
  }

  // Associate with logged-in user if token provided, or match existing user by email
  let userId = req.user?._id;
  if (!userId && clientEmail) {
    const existingUser = await User.findOne({ email: clientEmail.toLowerCase() });
    if (existingUser) userId = existingUser._id;
  }

  // Create event / booking record
  const newBooking = await Event.create({
    userId: userId || null,
    adminId,
    brideName: clientName,
    groomName: eventType || "Photoshoot Event",
    location: location || "Studio Client Location",
    eventDate: new Date(eventDate),
    eventEndDate: eventEndDate ? new Date(eventEndDate) : null,
    status: "Upcoming",
    isActive: true,
  });

  res.status(201).json({
    success: true,
    message: "Booking inquiry submitted successfully! The studio will contact you shortly.",
    data: newBooking,
  });
});
