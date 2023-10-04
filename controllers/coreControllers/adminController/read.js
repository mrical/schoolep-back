const { admin, db } = require('@/firebaseDB');


const read = async (req, res) => {
  try {
    // Find document by id
    const id = req.params.id;

    const snapshot = await db.doc(`users/${id}`).get();
    const tmpResult = snapshot.data();
    // If no results found, return document not found
    if (!tmpResult) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'No document found by this id: ' + req.params.id,
      });
    } else {
      // Return success resposne
      let result = {
        id: tmpResult.id,
        enabled: tmpResult.enabled,
        email: tmpResult.email,
        name: tmpResult.name,
        photo: tmpResult.profilePic,
        role: tmpResult.admin ? 'admin' : 'user',
      };

      return res.status(200).json({
        success: true,
        result,
        message: 'we found this document by this id: ' + req.params.id,
      });
    }
  } catch (error) {
    // Server Error
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Oops there is an Error',
      error,
    });
  }
};

module.exports = read;
