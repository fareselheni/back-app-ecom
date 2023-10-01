import Product from '../../models/product.model';
import Pricing from '../../models/pricing.model';
import axios from 'axios';

//--------------- add product-----------------------------//

export const addProduct = async (title: string, description: string, category: string, image: string) => {
  const product = new Product({ title, description,category,image });
  await product.save();
  return product;
};
//------------------add pricing---------------------------//
export const addPricing = async (productId: any ,country: string, price: number) => {
  // Check if a pricing entry already exists for the given product and country
  const existingPricing:any = await Pricing.findOne({ productId, country });

  if (existingPricing) {
    // If an entry already exists, update the price
    existingPricing.price = price;
    await existingPricing.save();
    return existingPricing;
  } else {
    // If no entry exists, create a new pricing entry
    const pricing = new Pricing({ productId, country, price });
    await pricing.save();
    return pricing;
  }
};
//-------------------- get price by country and product id-----------------//
export const getProductPriceByCountry = async (productId: string, country: string) => {
  try {
    const pricing: any = await Pricing.findOne({ productId, country });

    if (!pricing) {
      return 'not available'
    }

    return pricing.price;
  } catch (error) {
    console.error('Error fetching pricing:', error);
    throw error;
  }
};

export const getAllProducts = async () => {
  const products = await Product.find();

  return products;
};
export const getOneProduct = async (productId:any) => {
  const products = await Product.findById(productId);

  return products;
};
export const updateProduct = async (
  productId: string,
  updateFields: {
    title?: string;
    description?: string;
    category?: string;
    image?: string;
  }
) => {
  try {
    const product = await Product.findByIdAndUpdate(
      productId,
      updateFields,
      { new: true }
    );

    return product;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

// export const updateProduct = async (
//   productId: string,
//   title?: string,
//   description?: string,
//   category?: string,
//   image?:any
// ) => {
//   try {
//     const product = await Product.findByIdAndUpdate(
//       productId,
//       { title, description, category,image },
//       { new: true }
//     );

//     return product;
//   } catch (error) {
//     console.error('Error updating product:', error);
//     throw error;
//   }
// };

export const deleteProduct = async (productId: string) => {
  try {
    // Delete the product by ID
    await Product.findByIdAndRemove(productId);

    // Delete related prices
    await Pricing.deleteMany({ productId });
  } catch (error) {
    console.error('Error deleting product and related prices:', error);
    throw error;
  }
};

//----------------------get all countries------------------------//
export const getCountryInfo = async() => {
  try {
    // Make a GET request to the Rest Countries API
    const response = await axios.get('https://restcountries.com/v3.1/all');

    // Extract the desired information (e.g., country name and country code)
    const countryInfo = response.data.map((country:any) => ({
      name: country.name.common,
      code: country.cca2,
    }));
    return countryInfo
    // Print the country information
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}