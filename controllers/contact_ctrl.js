import { contactContentModel } from "../models/contacts/contact_content_model.js";
import { contactModel } from "../models/contacts/contact_us_model.js";

export const getContactData = async (req, res) => {
  try {
    const contactData = await contactModel.findOne().populate("content");
    return res.status(200).json(contactData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const addContactData = async (req, res) => {
  try {
    const { title, content } = req.body;
    let urlImg;
    if (req.files) {
      const imgPath = req.files["img"][0].path;
      urlImg = `${process.env.BASE_URL}` + imgPath.replace(/\\/g, "/");
    }

    const newContent = new contactContentModel({
      titleOne: content.titleOne,
      phoneNumber: content.phoneNumber,
      mobileOne: content.mobileOne,
      location: content.location,
      email: content.email,
      poBox: content.emailTwo,
      whatsApp: content.whatsApp,
      faceBook: content.faceBook,
      linkedIn: content.linkedIn,
      instagram: content.instagram,
      threads: content.threads,
      snapChat: content.snapChat,
      tiktok: content.tiktok,
      googleMap: content.googleMap,
    });

    const savedContent = await newContent.save();

    const newContact = new contactModel({
      title,
      img: urlImg,
      content: savedContent._id,
    });

    const savedContact = await newContact.save();

    return res.status(201).json({
      message: "Contact data created successfully",
      data: savedContact,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const editContactData = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const userId = req.userId;
    const adminId = process.env.ADMIN_ID;

    if (userId !== adminId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const contact = await contactModel.findById(id);

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    if (title) {
      contact.title = title;
    }

    if (content) {
      // Find and update the associated contactContent
      const contactContent = await contactContentModel.findById(
        contact.content
      );

      if (!contactContent) {
        return res.status(404).json({ message: "Contact Content not found" });
      }

      if (content.titleOne) {
        contactContent.titleOne = content.titleOne;
      }
      if (content.phoneNumber) {
        contactContent.phoneNumber = content.phoneNumber;
      }
      if (content.location) {
        contactContent.location = content.location;
      }
      if (content.email) {
        contactContent.email = content.email;
      }

      if (content.mobileOne) {
        contactContent.mobileOne = content.mobileOne;
      }

      if (content.whatsApp) {
        contactContent.whatsApp = content.whatsApp;
      }
      if (content.faceBook) {
        contactContent.faceBook = content.faceBook;
      }
      if (content.linkedIn) {
        contactContent.linkedIn = content.linkedIn;
      }
      if (content.instagram) {
        contactContent.instagram = content.instagram;
      }
      if (content.tiktok) {
        contactContent.tiktok = content.tiktok;
      }
      if (content.snapChat) {
        contactContent.snapChat = content.snapChat;
      }

      // Save the updated contactContent
      await contactContent.save();
    }

    // Save the updated contact
    const updatedContact = await contact.save();

    return res.status(200).json({
      message: "Contact data updated successfully",
      data: updatedContact,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const deleteContactData = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await contactModel.findById(id);

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    const contactContentData = await contactContentModel.findByIdAndRemove(
      contact.content
    );

    await contact.remove();

    return res.status(200).json({
      message: "Contact data deleted successfully",
      data: contact,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
