import { aboutModel } from "../models/about/about_model.js";

export const getAboutData = async (req, res) => {
  try {
    const aboutData = await aboutModel.findOne();

    return res.status(200).json(aboutData);
  } catch (error) {
    console.error(error);
    return res.status(500).json("Something went wrong");
  }
};

export const addAboutData = async (req, res) => {
  try {
    const { title, description, content } = req.body;

    const imgPath =
      req.files && req.files["img"] ? req.files["img"][0].path : null;
    const imgUrl = imgPath
      ? `${process.env.BASE_URL}/${imgPath.replace(/\\/g, "/")}`
      : null;

    let contentData = [];
    if (content && req.files) {
      contentData = JSON.parse(content).map((item, index) => ({
        ...item,
        img:
          req.files && req.files["contentImgs"]
            ? `${process.env.BASE_URL}/${req.files["contentImgs"][
                index
              ].path.replace(/\\/g, "/")}`
            : null,
      }));
    }

    const newAbout = new aboutModel({
      img: imgUrl,
      title,
      description,
      content: contentData,
    });

    await newAbout.save();

    return res.status(201).json("About added successfully");
  } catch (error) {
    console.error(error);
    return res.status(500).json("Something went wrong");
  }
};

export const editAboutData = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const imgPath =
      req.files && req.files["img"] ? req.files["img"][0].path : null;
    const imgUrl = imgPath
      ? `${process.env.BASE_URL}/${imgPath.replace(/\\/g, "/")}`
      : null;

    const existingAboutData = await aboutModel.findOne();
    if (!existingAboutData) {
      return res.status(404).json({ message: "About Us data not found" });
    }

    if (content && Array.isArray(content)) {
      existingAboutData.content = await Promise.all(
        content.map(async (item, index) => {
          return {
            title: item.title,
            description: item.description,
            img: existingAboutData.content[index].img,
          };
        })
      );
    }

    if (title) existingAboutData.title = title;
    if (imgUrl) existingAboutData.img = imgUrl;

    const savedAboutData = await existingAboutData.save();
    return res.status(200).json(savedAboutData);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
