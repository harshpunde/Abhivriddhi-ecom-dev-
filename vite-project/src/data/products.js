import jowarImg from '../assets/jowar-atta.png';

export const PRODUCTS_DATA = [
  { id: 1,  name: 'Jowar Atta',      category: 'Atta',    price: 275, inStock: true,  img: jowarImg, description: 'Light, gluten-free, and rooted in tradition just the way your body understands nourishment. Made from 100% natural sorghum grain, stone-ground to preserve nutrients.' },
  { id: 2,  name: 'Bajra Atta',      category: 'Atta',    price: 250, inStock: true,  img: jowarImg, description: 'Pearl millet flour packed with iron and essential minerals for your daily nutrition. Rich in magnesium, fiber and plant-based protein.' },
  { id: 3,  name: 'Ragi Atta',       category: 'Atta',    price: 299, inStock: true,  img: jowarImg, description: 'Iron and calcium-rich finger millet flour for healthy, wholesome everyday cooking. One of the richest plant-based sources of calcium.' },
  { id: 4,  name: 'Maize Atta',      category: 'Atta',    price: 220, inStock: true,  img: jowarImg, description: 'Stone-ground maize flour, naturally sweet and wholesome for traditional recipes. Perfect for makki ki roti and other classic dishes.' },
  { id: 5,  name: 'Wheat Flour',     category: 'Atta',    price: 195, inStock: false, img: jowarImg, description: 'Whole wheat flour stone-ground to retain maximum nutrition and earthy flavor. Cold-pressed to keep all the natural goodness intact.' },
  { id: 6,  name: 'Barnyard Millet', category: 'Millets', price: 290, inStock: true,  img: jowarImg, description: 'Low-calorie millet rich in fiber, iron and minerals perfect for a healthy diet. Ideal for those managing diabetes and weight.' },
  { id: 7,  name: 'Foxtail Millet',  category: 'Millets', price: 310, inStock: true,  img: jowarImg, description: 'High protein millet that is gluten-free, easy to digest and naturally delicious. A great alternative to rice and wheat.' },
  { id: 8,  name: 'Little Millet',   category: 'Millets', price: 280, inStock: true,  img: jowarImg, description: 'Tiny but mighty — a powerhouse of B vitamins, fiber and essential minerals. Cooks quickly and blends well in most recipes.' },
  { id: 9,  name: 'Kodo Millet',     category: 'Millets', price: 295, inStock: false, img: jowarImg, description: 'Ancient grain known for antidiabetic properties and high nutritional density. Rich in polyphenols and antioxidants.' },
  { id: 10, name: 'Brown Rice',      category: 'Rice',    price: 350, inStock: true,  img: jowarImg, description: 'Whole grain brown rice packed with dietary fiber and essential B vitamins. Naturally grown without pesticides or chemicals.' },
  { id: 11, name: 'Red Rice',        category: 'Rice',    price: 380, inStock: true,  img: jowarImg, description: 'Antioxidant-rich red rice with a nutty flavor, chewy texture and superior nutrition. Contains anthocyanins that support heart health.' },
  { id: 12, name: 'Organic Honey',   category: 'Honey',   price: 450, inStock: true,  img: jowarImg, description: 'Raw, unfiltered organic honey sourced directly from pristine forest hives. Never heated or processed — pure nature in every drop.' },
];

export const CATEGORIES = ['All', 'Atta', 'Millets', 'Rice', 'Honey'];

export const WEIGHT_OPTIONS = ['500gm', '750gm', '1Kg'];

export const SHIPPING_INFO = `We ship pan-India within 5–7 business days. Orders above ₹500 qualify for free shipping. All products are packed securely to ensure freshness. Tracking details are shared via SMS/email once your order is dispatched.`;
