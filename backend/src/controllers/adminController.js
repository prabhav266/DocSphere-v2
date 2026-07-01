const {
  getPendingUsers,
  approveUser,
  rejectUser,
  getPendingDocuments,
  approveDocument,
  rejectDocument,
} = require("../services/adminService");

const getPendingUsersController = async (req, res) => {
  try {
    const users = await getPendingUsers();

    res.json(users);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const approveUserController = async (req, res) => {
  try {
    const user = await approveUser(
      req.params.id,
      req.user.id
    );

    res.json({
      message: "User approved successfully",
      user,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const rejectUserController = async (req, res) => {
  try {
    await rejectUser(req.params.id);

    res.json({
      message: "User rejected",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const getPendingDocumentsController = async (req, res) => {
  try {
    const docs = await getPendingDocuments();

    res.json(docs);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const approveDocumentController = async (req, res) => {
  try {
    const doc = await approveDocument(
      req.params.id,
      req.user.id
    );

    res.json({
      message: "Document approved successfully",
      document: doc,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const rejectDocumentController = async (req, res) => {
  try {
    const doc = await rejectDocument(
      req.params.id,
      req.body.reason
    );

    res.json({
      message: "Document rejected",
      document: doc,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  getPendingUsersController,
  approveUserController,
  rejectUserController,

  getPendingDocumentsController,
  approveDocumentController,
  rejectDocumentController,
};