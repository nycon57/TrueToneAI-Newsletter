require('dotenv').config();
const Stripe = require('stripe');

async function updateProduct() {
  // Validate Stripe secret key environment variable
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY?.trim();

  if (!stripeSecretKey) {
    console.error('❌ Error: STRIPE_SECRET_KEY environment variable is not set or is empty.');
    console.error('Please set STRIPE_SECRET_KEY in your .env file or environment variables.');
    process.exit(1);
  }

  const stripe = new Stripe(stripeSecretKey);

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
