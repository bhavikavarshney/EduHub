const Material = require('../models/materialModel');
const logger = require('../utils/Logger');

// Get All Materials
const getAllMaterial = async (req, res) => {
  try {
    const { search, sort = 'title', page = 1, limit = 10 } = req.query;
    logger.info(`Fetching materials with search: "${search}", sort: "${sort}", page: ${page}, limit: ${limit}`);

    const searchQuery = { deleteFlag: false, ...(search ? { title: { $regex: search, $options: 'i' } } : {}) };

    const materials = await Material.find(searchQuery)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalMaterials = await Material.countDocuments(searchQuery);
    logger.info(`Found ${materials.length} materials out of ${totalMaterials} total`);
    res.status(200).json({ materials: materials, totalMaterials: totalMaterials });
  } catch (error) {
    logger.error(`Error fetching materials: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

// Get Material by ID
const getMaterialById = async (req, res) => {
  try {
    const { id } = req.params;
    logger.info(`Fetching material by ID: ${id}`);
    const material = await Material.findById(id);

    if (material) {
      res.status(200).json(material);
    } else {
      logger.warn(`Material not found: ${id}`);
      res.status(404).json({ message: 'Material not found' });
    }
  } catch (error) {
    logger.error(`Error fetching material by ID: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

// Get Materials by Course ID (Educator)
const getMaterialsByCourseIdEducator = async (req, res) => {
  try {
    const { search, sort = 'title', page = 1, limit = 5, courseId } = req.query;
    logger.info(`Fetching materials for educator course ID: ${courseId} with search: "${search}"`);

    const searchRegex = new RegExp(search, 'i');
    const searchQuery = {
      deleteFlag: false,
      ...(search
        ? {
          $or: [
            { title: searchRegex },
            { description: searchRegex },
            { contentType: searchRegex },
            { url: searchRegex }
          ]
        }
        : {})
    };

    const query = { courseId, ...searchQuery };

    const materials = await Material.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalMaterials = await Material.countDocuments(query);
    logger.info(`Found ${materials.length} materials for course ID: ${courseId}`);
    res.status(200).json({ materials, totalMaterials });
  } catch (error) {
    logger.error(`Error fetching materials by educator course ID: ${error.message}`);
    console.log(error.stack);
    res.status(500).json({ message: error.message });
  }
};

// Get Materials by Course ID (Student)
const getMaterialsByCourseId = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { page = 1, limit = 1 } = req.query;
    logger.info(`Fetching materials for student course ID: ${courseId}, page: ${page}, limit: ${limit}`);

    const materials = await Material.find({ courseId, deleteFlag: false })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalMaterials = await Material.countDocuments({ courseId, deleteFlag: false });

    res.status(200).json({ materials, totalMaterials });
  } catch (error) {
    logger.error(`Error fetching materials by course ID: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

// Add Material (without file)
const addMaterial = async (req, res) => {
  try {
    logger.info(`Adding material: ${JSON.stringify(req.body)}`);
    await Material.create(req.body);
    res.status(200).json({ message: 'Material added successfully' });
  } catch (error) {
    logger.error(`Error adding material: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

// Add Material with File

const addMaterialFile = async (req, res) => {
  try {
    const { title, description, contentType, courseId } = req.body;
    const file = req.file;

    if (!file) {
      logger.warn('File upload missing in addMaterialFile');
      return res.status(400).json({ message: 'File is required' });
    }

    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;

    logger.info(`Adding material with file: ${file.filename}`);

    const newMaterial = await Material.create({
      title,
      description,
      url: req.body.url, // store full image URL here
      contentType,
      courseId,
      file: file.filename,
      uploadDate: new Date()
    });

    res.status(200).json({ message: 'Material added successfully', material: newMaterial });
  } catch (error) {
    logger.error(`Error adding material with file: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};



// Update Material
const updateMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    logger.info(`Updating material ID: ${id}`);

    const updateData = {
      title: req.body.title,
      description: req.body.description,
      url: req.body.url,
      contentType: req.body.contentType,
    };

    if (req.file) {
      updateData.filePath = req.file.path;
      logger.info(`File updated for material ID: ${id}`);
    }

    const updatedMaterial = await Material.findByIdAndUpdate(id, updateData, { new: true });

    if (updatedMaterial) {
      res.status(200).json({ message: 'Material updated successfully', updatedMaterial });
    } else {
      logger.warn(`Material not found for update: ${id}`);
      res.status(404).json({ message: 'Material not found' });
    }
  } catch (error) {
    logger.error(`Error updating material: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

// Hard Delete Material
const deleteMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    logger.info(`Deleting material ID: ${id}`);
    const deletedMaterial = await Material.findByIdAndDelete(id);

    if (deletedMaterial) {
      res.status(200).json({ message: 'Material deleted successfully' });
    } else {
      logger.warn(`Material not found for deletion: ${id}`);
      res.status(404).json({ message: 'Material not found' });
    }
  } catch (error) {
    logger.error(`Error deleting material: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

// Soft Delete Material
const softDeleteMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    logger.info(`Soft deleting material ID: ${id}`);

    const updatedMaterial = await Material.findByIdAndUpdate(
      id,
      { deleteFlag: true },
      { new: true }
    );

    if (!updatedMaterial) {
      logger.warn(`Material not found for soft deletion: ${id}`);
      return res.status(404).json({ message: 'Material not found' });
    }

    logger.info(`Material marked as deleted: ${id}`);
    console.log("success deletion");
    res.status(200).json({ message: 'Material marked as deleted', material: updatedMaterial });
  } catch (error) {
    logger.error(`Error soft deleting material: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllMaterial,
  getMaterialById,
  addMaterial,
  getMaterialsByCourseId,
  addMaterialFile,
  updateMaterial,
  deleteMaterial,
  softDeleteMaterial,
  getMaterialsByCourseIdEducator
};