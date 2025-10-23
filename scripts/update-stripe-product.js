require('dotenv').config();
const Stripe = require('stripe');

async function updateProduct() {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    const product = await stripe.products.update('prod_T6puiReAgktFLt', {
      name: 'Spark Pro - TrueTone AI',
    });

    console.log('Product updated successfully:');
    console.log(`- Product ID: ${product.id}`);
    console.log(`- Name: ${product.name}`);
    console.log(`- Default Price: ${product.default_price}`);

    return product;
  } catch (error) {
    console.error('Error updating product:', error.message);
    throw error;
  }
}

updateProduct().then(() => {
  console.log('\n✅ Product name updated to "Spark Pro - TrueTone AI"');
  process.exit(0);
}).catch((error) => {
  console.error('\n❌ Failed to update product:', error);
  process.exit(1);
});
