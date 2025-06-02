import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function createStripeProducts() {
  try {
    console.log('Creating Stripe products for CodeBreaker...');
    
    // Create the main product
    const product = await stripe.products.create({
      name: 'Rescue Pro',
      description: 'Unlimited AI rescues with advanced features for developers',
    });

    console.log('Product created:', product.id);

    // Create monthly price
    const monthlyPrice = await stripe.prices.create({
      product: product.id,
      unit_amount: 999, // $9.99 in cents
      currency: 'usd',
      recurring: {
        interval: 'month',
      },
      nickname: 'Rescue Pro Monthly',
    });

    console.log('Monthly price created:', monthlyPrice.id);

    // Create yearly price (20% discount)
    const yearlyPrice = await stripe.prices.create({
      product: product.id,
      unit_amount: 9588, // $95.88 in cents (20% discount)
      currency: 'usd',
      recurring: {
        interval: 'year',
      },
      nickname: 'Rescue Pro Yearly',
    });

    console.log('Yearly price created:', yearlyPrice.id);

    console.log('\n=== Stripe Products Setup Complete ===');
    console.log(`Product ID: ${product.id}`);
    console.log(`Monthly Price ID: ${monthlyPrice.id}`);
    console.log(`Yearly Price ID: ${yearlyPrice.id}`);
    console.log('\nAdd these to your environment variables:');
    console.log(`STRIPE_PRO_MONTHLY_PRICE_ID=${monthlyPrice.id}`);
    console.log(`STRIPE_PRO_YEARLY_PRICE_ID=${yearlyPrice.id}`);

    return {
      product: product.id,
      monthlyPrice: monthlyPrice.id,
      yearlyPrice: yearlyPrice.id
    };
  } catch (error) {
    console.error('Error creating Stripe products:', error.message);
    process.exit(1);
  }
}

createStripeProducts();