import Company from '../models/company.js';





export const registerCompany = async (req, res) => {
  try {
    const { companyName } = req.body;

    if (!companyName) {
      return res.status(400).json({ message: "Company name is required", success: false });
    }

    let company = await Company.findOne({ name: companyName });
    if (company) {
      return res.status(400).json({ message: "You can't add same company" , success: false});
    }

    company = await Company.create({
      name: companyName,
      userId: req.id || null, // avoid breaking if req.id is missing
    });

    return res.status(201).json({
      message: "Company registered successfully",
      company,
      success: true
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};









export const getCompany = async (req, res) => {
  try {
    const userId = req.id;

    const company = await Company.find({ userId });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found"
      });
    }
    return res.status(200).json({
            company,
            success: true
    })

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};










export const getCompanyById = async (req,res) => {
    try{
        const companyId = req.params.id;
        const company = await Company.findById(companyId);
        if (!company) {
          return res.status(404).json({
            success: false,
            message: "Company not found"
          });
        }
        return res.status(200).json({
            company,
            success: true
        })
    }catch(error){
        console.log(error);
    }
}











export const updateCompany = async (req, res) => {
    try {
        const { name, description, location } = req.body;
        const file = req.file;
        
    
        const updateData = { name, description, location };

        const company = await Company.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            })
        }
        return res.status(200).json({
            message:"Company information updated.",
            success: true
        })

    } catch (error) {
        console.log(error);
    }
}