export const WILAYAS = [
  "Adrar","Chlef","Laghouat","Oum El Bouaghi","Batna","Béjaïa","Biskra","Béchar","Blida","Bouira",
  "Tamanrasset","Tébessa","Tlemcen","Tiaret","Tizi Ouzou","Alger","Djelfa","Jijel","Sétif","Saïda",
  "Skikda","Sidi Bel Abbès","Annaba","Guelma","Constantine","Médéa","Mostaganem","M'Sila","Mascara",
  "Ouargla","Oran","El Bayadh","Illizi","Bordj Bou Arréridj","Boumerdès","El Tarf","Tindouf",
  "Tissemsilt","El Oued","Khenchela","Souk Ahras","Tipaza","Mila","Aïn Defla","Naâma",
  "Aïn Témouchent","Ghardaïa","Relizane","Timimoun","Bordj Badji Mokhtar","Ouled Djellal",
  "Béni Abbès","In Salah","In Guezzam","Touggourt","Djanet","El M'Ghair","El Meniaa",
]

export const CATS = [
  {name:"Couscous", icon:"🥘"}, {name:"Tagine", icon:"🫕"}, {name:"Grillades", icon:"🥩"},
  {name:"Pâtisseries", icon:"🧁"}, {name:"Soupes", icon:"🍲"}, {name:"Kabyle", icon:"🫙"},
  {name:"Sandwich", icon:"🥪"}, {name:"Salades", icon:"🥗"},
]

export const DISH_PHOTOS = {
  101:'/images/dish_couscous.png',102:'/images/dish_couscous.png',103:'/images/dish_couscous.png',
  104:'/images/dish_couscous.png',105:'/images/dish_couscous.png',602:'/images/dish_couscous.png',
  601:'/images/dish_couscous.png',201:'/images/dish_grillades.png',202:'/images/dish_grillades.png',
  203:'/images/dish_grillades.png',204:'/images/dish_grillades.png',205:'/images/dish_tagine.png',
  501:'/images/dish_tagine.png',502:'/images/dish_tagine.png',503:'/images/dish_tagine.png',
  401:'/images/dish_baklawa.png',402:'/images/dish_baklawa.png',403:'/images/dish_baklawa.png',
  404:'/images/dish_baklawa.png',405:'/images/dish_baklawa.png',
}

export const KITCHENS = [
  {id:1, name:"Dar Fatima", tagline:"Cuisine algéroise authentique depuis 1995", wilaya:"Alger", commune:"Bab El Oued", rating:4.9, reviews:237, cat:"Couscous", minOrder:500, deliveryFee:200, deliveryTime:45, open:true, gradient:"linear-gradient(135deg,#6B2D0F,#C4632A,#7A3010)", emoji:"🥘", desc:"Fatima prépare la meilleure cuisine algéroise depuis plus de 25 ans.", menu:[
    {cat:"Couscous", dishes:[
      {id:101,name:"Couscous au Poulet", desc:"Semoule fine, légumes de saison et poulet fermier", price:950, emoji:"🥘", gradient:"linear-gradient(135deg,#7A5A0A,#C89520)"},
      {id:102,name:"Couscous Royal", desc:"Couscous festif avec merguez maison, kefta grillée", price:1450, emoji:"👑", gradient:"linear-gradient(135deg,#6A1010,#B83030)"},
      {id:103,name:"Couscous 7 Légumes", desc:"Version végétarienne généreuse", price:800, emoji:"🌿", gradient:"linear-gradient(135deg,#1A5C2E,#2D8C4E)"},
    ]},
    {cat:"Plats traditionnels", dishes:[
      {id:104,name:"Rechta", desc:"Pâtes fines maison, sauce blanche, poulet fondant", price:900, emoji:"🍜", gradient:"linear-gradient(135deg,#4A3520,#8B6840)"},
      {id:105,name:"Chakhchoukha", desc:"Galettes émiettées avec sauce tomate-légumes", price:850, emoji:"🫙", gradient:"linear-gradient(135deg,#6B2410,#B84020)"},
    ]},
    {cat:"Soupes", dishes:[
      {id:107,name:"Harira", desc:"Soupe réconfortante aux tomates, lentilles", price:280, emoji:"🍲", gradient:"linear-gradient(135deg,#8B2020,#CC4C20)"},
      {id:108,name:"Chorba Frik", desc:"Soupe épaisse au blé concassé", price:320, emoji:"🫕", gradient:"linear-gradient(135deg,#4A4010,#8B7820)"},
    ]},
  ]},
  {id:2, name:"Le Goût d'Oran", tagline:"Saveurs méditerranéennes & grillades oranaises", wilaya:"Oran", commune:"Es Senia", rating:4.7, reviews:189, cat:"Grillades", minOrder:600, deliveryFee:150, deliveryTime:35, open:true, gradient:"linear-gradient(135deg,#0D2B4A,#1A5FA0,#0E3A70)", emoji:"🥩", desc:"La famille Bensalem perpétue les traditions culinaires oranaises.", menu:[
    {cat:"Grillades", dishes:[
      {id:201,name:"Merguez Maison", desc:"Saucisses d'agneau épicées grillées", price:750, emoji:"🌭", gradient:"linear-gradient(135deg,#6B1010,#B82020)"},
      {id:202,name:"Brochettes d'Agneau", desc:"Brochettes marinées 24h", price:950, emoji:"🍢", gradient:"linear-gradient(135deg,#5C3010,#A05020)"},
      {id:203,name:"Poulet Grillé", desc:"Demi-poulet mariné aux épices oranaises", price:850, emoji:"🍗", gradient:"linear-gradient(135deg,#6B5010,#B08020)"},
      {id:204,name:"Kefta Grillée", desc:"Boulettes de viande hachée épicées", price:700, emoji:"🥙", gradient:"linear-gradient(135deg,#5C2020,#9A4020)"},
    ]},
    {cat:"Plats", dishes:[
      {id:205,name:"Tajine Zitoun", desc:"Poulet aux olives et citron confit", price:900, emoji:"🫕", gradient:"linear-gradient(135deg,#2A4A10,#4A8020)"},
    ]},
  ]},
  {id:3, name:"Tizi Kitchen", tagline:"Authenticité kabyle, saveurs des montagnes", wilaya:"Tizi Ouzou", commune:"Tizi Ouzou", rating:4.8, reviews:156, cat:"Kabyle", minOrder:450, deliveryFee:180, deliveryTime:50, open:true, gradient:"linear-gradient(135deg,#1A3A1A,#2E6E2A,#1A4A18)", emoji:"🫙", desc:"Tassadit vous invite à découvrir la richesse de la cuisine kabyle.", menu:[
    {cat:"Spécialités Kabyles", dishes:[
      {id:301,name:"Ith Meksayen", desc:"Plat kabyle aux haricots blancs", price:720, emoji:"🫘", gradient:"linear-gradient(135deg,#3A5020,#6A8040)"},
      {id:302,name:"Aakoul (Couscous Kabyle)", desc:"Couscous d'orge kabyle", price:800, emoji:"🌾", gradient:"linear-gradient(135deg,#6B5A10,#A08A20)"},
      {id:303,name:"Lemsamen au Miel", desc:"Crêpes feuilletées kabyles", price:350, emoji:"🥞", gradient:"linear-gradient(135deg,#7A4A10,#C08020)"},
    ]},
  ]},
  {id:4, name:"Baya Sweets", tagline:"Pâtisseries orientales de Constantine", wilaya:"Constantine", commune:"Constantine", rating:4.9, reviews:312, cat:"Pâtisseries", minOrder:300, deliveryFee:120, deliveryTime:30, open:true, gradient:"linear-gradient(135deg,#4A1A6A,#8A3AAC,#5A1A8A)", emoji:"🧁", desc:"Baya perpétue l'art des pâtisseries constantinoises depuis 3 générations.", menu:[
    {cat:"Pâtisseries traditionnelles", dishes:[
      {id:401,name:"Baklawa Royale (12 pcs)", desc:"Feuilletage de pâte filo aux amandes", price:680, emoji:"🍯", gradient:"linear-gradient(135deg,#6B4A10,#B08030)"},
      {id:402,name:"Makrout aux Dattes (1kg)", desc:"Semoule fine farcie aux dattes Deglet Nour", price:580, emoji:"🌙", gradient:"linear-gradient(135deg,#5C3A10,#9A6020)"},
      {id:403,name:"Chebakia (500g)", desc:"Gâteaux frits en rosette", price:420, emoji:"🌹", gradient:"linear-gradient(135deg,#7A2A20,#C04A30)"},
      {id:404,name:"Qalb Louz", desc:"Gâteau d'amandes et semoule", price:380, emoji:"💛", gradient:"linear-gradient(135deg,#7A6A10,#C0A820)"},
    ]},
  ]},
  {id:5, name:"Sahara Flavors", tagline:"Les saveurs authentiques du désert algérien", wilaya:"Ghardaïa", commune:"Ghardaïa", rating:4.6, reviews:98, cat:"Tagine", minOrder:550, deliveryFee:200, deliveryTime:60, open:false, gradient:"linear-gradient(135deg,#4A3010,#8B6020,#6A4010)", emoji:"🏜️", desc:"Fatma du M'Zab vous invite à découvrir les traditions culinaires du désert.", menu:[
    {cat:"Tagines du désert", dishes:[
      {id:501,name:"Tagine d'Agneau", desc:"Agneau du Sahara aux pruneaux", price:1100, emoji:"🫕", gradient:"linear-gradient(135deg,#6B3020,#AA5030)"},
      {id:502,name:"Tagine Kefta", desc:"Boulettes de viande en sauce tomate", price:750, emoji:"🥚", gradient:"linear-gradient(135deg,#5C2010,#9A4020)"},
      {id:503,name:"Tagine Légumes", desc:"Légumes du désert confits", price:600, emoji:"🥬", gradient:"linear-gradient(135deg,#1A4A1A,#2E7A2E)"},
    ]},
  ]},
  {id:6, name:"Dar Khadidja", tagline:"Spécialités des Hauts Plateaux sétifiens", wilaya:"Sétif", commune:"Sétif", rating:4.7, reviews:143, cat:"Couscous", minOrder:480, deliveryFee:160, deliveryTime:40, open:true, gradient:"linear-gradient(135deg,#1A1A3A,#2E2E6A,#1A1A4A)", emoji:"🥗", desc:"Khadidja perpétue la cuisine des Hautes Plaines sétifiennes.", menu:[
    {cat:"Couscous", dishes:[
      {id:601,name:"Couscous Sétifien", desc:"Couscous aux 7 légumes et agneau", price:900, emoji:"🥘", gradient:"linear-gradient(135deg,#6B5010,#A08020)"},
    ]},
  ]},
]

export const MOCK_DASH_ORDERS = [
  {id:"DRC-1001", client:"Sofiane B.", items:"Couscous au Poulet, Chorba Frik", total:1270, status:"nouveau", time:"12:30"},
  {id:"DRC-1002", client:"Lina M.", items:"Rechta, Baklawa Royale", total:1580, status:"preparation", time:"11:45"},
  {id:"DRC-1003", client:"Amine K.", items:"Merguez Maison (x2), Salade Oranaise", total:1700, status:"livre", time:"10:20"},
  {id:"DRC-1004", client:"Yasmine H.", items:"Couscous Royal", total:1450, status:"nouveau", time:"13:00"},
  {id:"DRC-1005", client:"Rachid T.", items:"Tagine d'Agneau, Jus d'orange", total:1250, status:"preparation", time:"12:10"},
]

export const COMMUNES = {
  "Alger":["Alger Centre","Bab El Oued","Hussein Dey","El Harrach","Kouba","Rouïba","Dar El Beïda","Bab Ezzouar","Ben Aknoun","Hydra","Bir Mourad Raïs","El Biar","Belouizdad","El Madania","Baraki","Bachdjerrah","Birtouta","Sidi M'Hamed","Bourouba","Cheraga","Dely Ibrahim","El Achour","Ouled Fayet","Gue de Constantine","Bordj El Kiffan","Bouzareah","Casbah"],
  "Oran":["Oran","Es Senia","Bir El Djir","Aïn El Turck","Arzew","Bethioua","El Kerma","Gdyel","Hassi Ben Okba","Boutlelis","Oued Tlelat"],
  "Constantine":["Constantine","El Khroub","Aïn Abid","Didouche Mourad","Hamma Bouziane","Ibn Ziad","Ouled Rahmoune","Zighoud Youcef"],
  "Sétif":["Sétif","Aïn Azel","Aïn El Kebira","Aïn Oulmene","Bougaa","El Eulma","Guenzet","Salah Bey"],
  "Tizi Ouzou":["Tizi Ouzou","Azazga","Beni Douala","Boghni","Draa Ben Khedda","Draa El Mizan","Ouacifs","Ouadhias","Tigzirt"],
  "Ghardaïa":["Ghardaïa","Berriane","Bounoura","El Atteuf","Guerrara","Metlili"],
}
