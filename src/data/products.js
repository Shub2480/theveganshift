// Initial products data for The Vegan Shift
// All products are 100% vegan, organic, and plant-based

export const initialProducts = [
    {
        id: 'soya-milk-1l',
        name: 'Organic Soya Milk',
        slug: 'soya-milk',
        category: 'Dairy Alternatives',
        price: 80,
        originalPrice: 95,
        unit: '1 Liter',
        inStock: true,
        stockQuantity: 150,
        featured: true,
        images: [
            '/images/soya-milk-1.jpg',
            '/images/soya-milk-2.jpg',
            '/images/soya-milk-3.jpg'
        ],
        shortDescription: 'Creamy, nutritious plant-based milk made from premium organic soybeans.',
        description: `Our Organic Soya Milk is crafted from the finest hand-selected soybeans, grown without pesticides or chemicals. This creamy, delicious milk alternative is perfect for drinking, cooking, or adding to your morning coffee.

Rich in plant-based protein and fortified with calcium and vitamins, our soya milk provides all the goodness you need to start your day right. The smooth, naturally sweet taste makes it a favorite for the whole family.`,
        benefits: [
            'High in plant-based protein (7g per serving)',
            'Rich in calcium and Vitamin D',
            'Lactose-free and dairy-free',
            'No added preservatives',
            'Low in saturated fat'
        ],
        nutritionalInfo: {
            servingSize: '250ml',
            calories: 80,
            protein: '7g',
            carbohydrates: '4g',
            fat: '4g',
            fiber: '1g',
            calcium: '300mg (30% DV)',
            vitaminD: '2.5mcg (12% DV)',
            vitaminB12: '1mcg (40% DV)'
        },
        ingredients: 'Filtered Water, Organic Soybeans (10%), Calcium Carbonate, Sea Salt, Natural Flavoring, Vitamin D2, Vitamin B12.',
        allergens: 'Contains: Soy',
        storageInstructions: 'Keep refrigerated. Once opened, consume within 5 days. Shake well before use.',
        reviews: [
            {
                id: 1,
                author: 'Priya M.',
                rating: 5,
                date: '2025-12-15',
                comment: 'Best soya milk I have ever tasted! Creamy texture and not too sweet. My kids love it!',
                verified: true
            },
            {
                id: 2,
                author: 'Rahul K.',
                rating: 4,
                date: '2025-12-10',
                comment: 'Great quality and fresh taste. Perfect for my morning smoothies.',
                verified: true
            },
            {
                id: 3,
                author: 'Anjali S.',
                rating: 5,
                date: '2025-12-05',
                comment: 'Finally found a truly organic soya milk! Will definitely order again.',
                verified: true
            }
        ],
        averageRating: 4.7,
        reviewCount: 128,
        tags: ['organic', 'vegan', 'dairy-free', 'high-protein', 'calcium-fortified']
    },
    {
        id: 'soya-curd-400g',
        name: 'Organic Soya Curd',
        slug: 'soya-curd',
        category: 'Dairy Alternatives',
        price: 60,
        originalPrice: 70,
        unit: '400g',
        inStock: true,
        stockQuantity: 80,
        featured: true,
        images: [
            '/images/soya-curd-1.jpg',
            '/images/soya-curd-2.jpg',
            '/images/soya-curd-3.jpg'
        ],
        shortDescription: 'Thick, creamy probiotic curd made from organic soya for a healthy gut.',
        description: `Our Organic Soya Curd is a delicious, probiotic-rich dairy alternative that's perfect for your digestive health. Made using traditional fermentation methods with carefully selected vegan cultures, this curd has the same tangy, creamy texture you love.

Whether you enjoy it with your meals, use it in recipes, or blend it into smoothies, our soya curd delivers excellent nutrition without any dairy. It's naturally cholesterol-free and packed with plant-based protein.`,
        benefits: [
            'Contains live probiotic cultures',
            'Good source of plant protein (5g per serving)',
            'Supports digestive health',
            'Cholesterol-free',
            'Perfect for traditional Indian recipes'
        ],
        nutritionalInfo: {
            servingSize: '100g',
            calories: 60,
            protein: '5g',
            carbohydrates: '3g',
            fat: '3g',
            fiber: '0.5g',
            calcium: '120mg (12% DV)',
            probiotics: '1 billion CFU'
        },
        ingredients: 'Organic Soya Milk, Vegan Probiotic Cultures (L. acidophilus, B. bifidum).',
        allergens: 'Contains: Soy',
        storageInstructions: 'Keep refrigerated at 4°C. Consume within 7 days of opening. Best before date on pack.',
        reviews: [
            {
                id: 1,
                author: 'Meera P.',
                rating: 5,
                date: '2025-12-18',
                comment: 'Tastes just like regular curd! My grandmother who is lactose intolerant loves it.',
                verified: true
            },
            {
                id: 2,
                author: 'Vikram T.',
                rating: 4,
                date: '2025-12-12',
                comment: 'Great for making raita and lassi. Slightly different texture but very good.',
                verified: true
            }
        ],
        averageRating: 4.5,
        reviewCount: 89,
        tags: ['organic', 'vegan', 'probiotic', 'dairy-free', 'gut-health']
    },
    {
        id: 'soya-paneer-200g',
        name: 'Organic Soya Paneer (Tofu)',
        slug: 'soya-paneer',
        category: 'Dairy Alternatives',
        price: 90,
        originalPrice: 110,
        unit: '200g',
        inStock: true,
        stockQuantity: 60,
        featured: true,
        images: [
            '/images/soya-paneer-1.jpg',
            '/images/soya-paneer-2.jpg',
            '/images/soya-paneer-3.jpg'
        ],
        shortDescription: 'Firm, protein-rich soya paneer perfect for curries, grills, and stir-fries.',
        description: `Our Organic Soya Paneer (Tofu) is the perfect plant-based protein for all your favorite Indian dishes. Made from premium organic soybeans using traditional Japanese techniques, this firm tofu holds its shape beautifully whether you're making paneer tikka, kadai paneer, or a healthy stir-fry.

With more protein per gram than regular paneer and zero cholesterol, our soya paneer is the healthier choice for protein lovers. It absorbs marinades and spices wonderfully, making every dish flavorful and satisfying.`,
        benefits: [
            'Complete plant protein (18g per pack)',
            'Zero cholesterol',
            'Firm texture - perfect for cooking',
            'Absorbs flavors beautifully',
            'Lower in calories than dairy paneer'
        ],
        nutritionalInfo: {
            servingSize: '100g',
            calories: 120,
            protein: '9g',
            carbohydrates: '2g',
            fat: '6g',
            fiber: '1g',
            calcium: '200mg (20% DV)',
            iron: '2mg (11% DV)'
        },
        ingredients: 'Organic Soybeans, Water, Calcium Sulfate (natural coagulant).',
        allergens: 'Contains: Soy',
        storageInstructions: 'Keep refrigerated. Once opened, store in water and consume within 3 days. Can be frozen for up to 3 months.',
        reviews: [
            {
                id: 1,
                author: 'Sanjay R.',
                rating: 5,
                date: '2025-12-20',
                comment: 'Made the best paneer butter masala with this! Texture is perfect and it doesn\'t crumble.',
                verified: true
            },
            {
                id: 2,
                author: 'Deepa L.',
                rating: 5,
                date: '2025-12-14',
                comment: 'As a vegan, I missed paneer so much. This is a game changer! Highly recommend.',
                verified: true
            },
            {
                id: 3,
                author: 'Amit G.',
                rating: 4,
                date: '2025-12-08',
                comment: 'Good quality tofu. Works great in tikka and grilled recipes.',
                verified: true
            }
        ],
        averageRating: 4.8,
        reviewCount: 156,
        tags: ['organic', 'vegan', 'high-protein', 'dairy-free', 'tofu']
    }
];

// Default coupons
export const initialCoupons = [
    {
        id: 'coupon-1',
        code: 'WELCOME10',
        description: 'Welcome discount for new customers',
        discountType: 'percentage',
        discountValue: 10,
        minOrderAmount: 100,
        maxDiscount: 500,
        validFrom: '2025-01-01',
        validUntil: '2026-12-31',
        isActive: true,
        usageLimit: 1000,
        usageCount: 45
    },
    {
        id: 'coupon-2',
        code: 'VEGAN20',
        description: 'Special vegan day discount',
        discountType: 'percentage',
        discountValue: 20,
        minOrderAmount: 200,
        maxDiscount: 1000,
        validFrom: '2025-01-01',
        validUntil: '2026-12-31',
        isActive: true,
        usageLimit: 500,
        usageCount: 12
    },
    {
        id: 'coupon-3',
        code: 'FLAT50',
        description: 'Flat ₹50 off on orders above ₹250',
        discountType: 'fixed',
        discountValue: 50,
        minOrderAmount: 250,
        maxDiscount: 50,
        validFrom: '2025-01-01',
        validUntil: '2026-12-31',
        isActive: true,
        usageLimit: 200,
        usageCount: 8
    }
];

// Sample orders for admin dashboard
export const sampleOrders = [
    {
        id: 'ORD-2026-001',
        date: '2026-01-08T10:30:00',
        customer: {
            name: 'Ravi Kumar',
            email: 'ravi.kumar@email.com',
            phone: '+91 98765 43210',
            address: '123 MG Road, Andheri West, Mumbai 400058'
        },
        items: [
            { productId: 'soya-milk-1l', name: 'Organic Soya Milk', quantity: 2, price: 80 },
            { productId: 'soya-curd-400g', name: 'Organic Soya Curd', quantity: 1, price: 60 }
        ],
        subtotal: 220,
        discount: 22,
        couponCode: 'WELCOME10',
        shipping: 0,
        total: 198,
        status: 'delivered',
        paymentMethod: 'COD',
        notes: ''
    },
    {
        id: 'ORD-2026-002',
        date: '2026-01-08T14:15:00',
        customer: {
            name: 'Sneha Patel',
            email: 'sneha.p@email.com',
            phone: '+91 87654 32109',
            address: '456 Link Road, Bandra East, Mumbai 400051'
        },
        items: [
            { productId: 'soya-paneer-200g', name: 'Organic Soya Paneer', quantity: 3, price: 90 }
        ],
        subtotal: 270,
        discount: 0,
        couponCode: null,
        shipping: 0,
        total: 270,
        status: 'shipped',
        paymentMethod: 'COD',
        notes: 'Please deliver after 5 PM'
    },
    {
        id: 'ORD-2026-003',
        date: '2026-01-08T16:45:00',
        customer: {
            name: 'Amit Shah',
            email: 'amit.shah@email.com',
            phone: '+91 76543 21098',
            address: '789 Hill Road, Bandra West, Mumbai 400050'
        },
        items: [
            { productId: 'soya-milk-1l', name: 'Organic Soya Milk', quantity: 4, price: 80 },
            { productId: 'soya-curd-400g', name: 'Organic Soya Curd', quantity: 2, price: 60 },
            { productId: 'soya-paneer-200g', name: 'Organic Soya Paneer', quantity: 2, price: 90 }
        ],
        subtotal: 620,
        discount: 50,
        couponCode: 'FLAT50',
        shipping: 0,
        total: 570,
        status: 'pending',
        paymentMethod: 'COD',
        notes: ''
    }
];

// Hero slider data - matched to actual hero images
export const heroSlides = [
    {
        id: 1,
        title: 'Pure Plant Power',
        subtitle: '100% Organic Vegan Products',
        description: 'Discover the goodness of nature with our premium soya products',
        cta: 'Shop Now',
        ctaLink: '/products',
        image: '/images/hero-soya-milk.jpg',
        gradient: 'linear-gradient(135deg, rgba(45, 80, 22, 0.9), rgba(90, 156, 42, 0.7))'
    },
    {
        id: 2,
        title: 'Healthy Living Starts Here',
        subtitle: 'High Protein • Low Fat • Zero Cholesterol',
        description: 'Switch to plant-based dairy alternatives today',
        cta: 'Explore Products',
        ctaLink: '/products',
        image: '/images/hero-products.jpg',
        gradient: 'linear-gradient(135deg, rgba(26, 61, 12, 0.9), rgba(74, 124, 35, 0.7))'
    },
    {
        id: 3,
        title: 'Fresh from Mumbai',
        subtitle: 'Made Daily • Delivered Fresh',
        description: 'Supporting local organic farmers since 2020',
        cta: 'Learn More',
        ctaLink: '/contact',
        image: '/images/hero-fresh.jpg',
        gradient: 'linear-gradient(135deg, rgba(58, 107, 28, 0.9), rgba(122, 184, 74, 0.7))'
    }
];

// Testimonials
export const testimonials = [
    {
        id: 1,
        name: 'Dr. Anita Sharma',
        role: 'Nutritionist',
        image: '/images/testimonial-1.jpg',
        quote: 'I recommend The Vegan Shift products to all my clients looking for healthy dairy alternatives. The quality is exceptional!',
        rating: 5
    },
    {
        id: 2,
        name: 'Rajesh Mehta',
        role: 'Fitness Enthusiast',
        image: '/images/testimonial-2.jpg',
        quote: 'As an athlete, protein is crucial for me. Their soya paneer gives me the protein I need without any cholesterol.',
        rating: 5
    },
    {
        id: 3,
        name: 'Kavita Rao',
        role: 'Home Chef',
        image: '/images/testimonial-3.jpg',
        quote: 'The soya curd is perfect for my recipes. My family couldn\'t tell the difference from regular curd!',
        rating: 4
    }
];

// Company info
export const companyInfo = {
    name: 'The Vegan Shift',
    tagline: '100% Plant-Based • Organic • Vegan',
    phone: '+91 9773523131',
    email: 'contact@theveganshift.com',
    address: 'Shop No. 12, Organic Market Complex, Andheri West, Mumbai - 400058, Maharashtra, India',
    socialLinks: {
        facebook: 'https://facebook.com/theveganshift',
        instagram: 'https://instagram.com/theveganshift',
        twitter: 'https://twitter.com/theveganshift'
    },
    businessHours: {
        weekdays: '9:00 AM - 8:00 PM',
        saturday: '9:00 AM - 6:00 PM',
        sunday: '10:00 AM - 4:00 PM'
    }
};
