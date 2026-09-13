const { PrismaClient } = require('@prisma/client');
const { uploadBufferToCloudinary } = require('../services/cloudinaryService');
const prisma = new PrismaClient();

// Get all student branches (with optional officers)
const getStudentBranches = async (req, res) => {
  try {
    const branches = await prisma.studentBranch.findMany({
      include: {
        officers: true
      },
      orderBy: {
        name: 'asc'
      }
    });

    return res.status(200).json({
      success: true,
      branches
    });
  } catch (error) {
    console.error('Error fetching student branches:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve student branches.'
    });
  }
};

// Get single student branch details (with officers)
const getStudentBranchById = async (req, res) => {
  try {
    const { id } = req.params;
    const branch = await prisma.studentBranch.findUnique({
      where: { id },
      include: {
        officers: {
          orderBy: [
            { year: 'desc' },
            { role: 'asc' }
          ]
        }
      }
    });

    if (!branch) {
      return res.status(404).json({
        success: false,
        message: 'Student branch not found.'
      });
    }

    return res.status(200).json({
      success: true,
      branch
    });
  } catch (error) {
    console.error('Error fetching student branch details:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve student branch details.'
    });
  }
};

// Create a new student branch
const createStudentBranch = async (req, res) => {
  try {
    const { name, code, established, logo_url, officers } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Student branch name is required.'
      });
    }

    // Handle Cloudinary logo upload
    let logoUrl = logo_url || null;
    const files = req.files || {};
    if (files.logo && files.logo[0]) {
      const uploadResult = await uploadBufferToCloudinary(files.logo[0].buffer, 'branches/logos', 'image');
      logoUrl = uploadResult.secure_url;
    }

    // Parse officers if sent as a string/JSON
    let parsedOfficers = [];
    if (officers) {
      parsedOfficers = typeof officers === 'string' ? JSON.parse(officers) : officers;
    }

    const branch = await prisma.studentBranch.create({
      data: {
        name,
        code: code || null,
        logoUrl,
        established: established ? new Date(established) : null,
        officers: {
          create: parsedOfficers.map(o => ({
            name: o.name,
            role: o.role,
            ieeeNumber: o.ieeeNumber || null,
            email: o.email || null,
            year: parseInt(o.year) || new Date().getFullYear()
          }))
        }
      },
      include: {
        officers: true
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Student branch created successfully.',
      branch
    });
  } catch (error) {
    console.error('Error creating student branch:', error);
    if (error.code === 'P2002') {
      return res.status(400).json({
        success: false,
        message: 'A student branch with this name already exists.'
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Failed to create student branch.'
    });
  }
};

// Update a student branch (including replacing its officers list)
const updateStudentBranch = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, established, logo_url, officers } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Student branch name is required.'
      });
    }

    // Handle Cloudinary logo upload
    let logoUrl = logo_url || null;
    const files = req.files || {};
    if (files.logo && files.logo[0]) {
      const uploadResult = await uploadBufferToCloudinary(files.logo[0].buffer, 'branches/logos', 'image');
      logoUrl = uploadResult.secure_url;
    }

    // Parse officers if sent as string/JSON
    let parsedOfficers = [];
    if (officers) {
      parsedOfficers = typeof officers === 'string' ? JSON.parse(officers) : officers;
    }

    // Run delete and update inside a transaction to prevent database inconsistency
    const updatedBranch = await prisma.$transaction(async (tx) => {
      // 1. Delete all existing officers first
      await tx.branchOfficer.deleteMany({
        where: { branchId: id }
      });

      // 2. Update the main branch info and insert the new officers
      return await tx.studentBranch.update({
        where: { id },
        data: {
          name,
          code: code || null,
          logoUrl,
          established: established ? new Date(established) : null,
          officers: {
            create: parsedOfficers.map(o => ({
              name: o.name,
              role: o.role,
              ieeeNumber: o.ieeeNumber || null,
              email: o.email || null,
              year: parseInt(o.year) || new Date().getFullYear()
            }))
          }
        },
        include: {
          officers: true
        }
      });
    });

    return res.status(200).json({
      success: true,
      message: 'Student branch updated successfully.',
      branch: updatedBranch
    });
  } catch (error) {
    console.error('Error updating student branch:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update student branch.'
    });
  }
};

// Delete a student branch (officers are cascade-deleted)
const deleteStudentBranch = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.studentBranch.delete({
      where: { id }
    });

    return res.status(200).json({
      success: true,
      message: 'Student branch deleted successfully.'
    });
  } catch (error) {
    console.error('Error deleting student branch:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete student branch.'
    });
  }
};

module.exports = {
  getStudentBranches,
  getStudentBranchById,
  createStudentBranch,
  updateStudentBranch,
  deleteStudentBranch
};
