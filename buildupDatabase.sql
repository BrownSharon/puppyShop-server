-- create database PuppyShop;

-- use PuppyShop;

-- CREATE TABLE outhorization (
--   id int NOT NULL AUTO_INCREMENT,
--   role varchar(15) DEFAULT NULL,
--   PRIMARY KEY (id)
-- );

-- insert into outhorization (role)
-- values ("administrator"),
-- ("user");

-- CREATE TABLE user (
--   id int auto_increment not null, 	
--   israeliID int NOT NULL unique,
--   email varchar(20) NOT NULL unique,
--   password varchar(200) NOT NULL,
--   role_id int NOT NULL,
--   first_name varchar(20) NOT NULL,
--   last_name varchar(50) NOT NULL,
--   city varchar(20) NOT NULL,
--   street varchar(30) NOT NULL,
--   primary key (id),
--   foreign key (role_id) references outhorization(id)
-- );

-- insert into user (israeliID, email, password, role_id, first_name, last_name, city, street)
-- values (040090094, "admin@gmail.com","$2b$10$Iaf.ODSZtEtFIk6Xz.SpJ.Z8/dbIT3c.r3fDDuFmrZP92S0T2MNIq",1,"sharon","brown","Petach Tikva", "Derech Menachem Begin"),
-- (216228262, "benben@gmail.com","$2b$10$QhbgtLTwUj2N/dgSjgkIYOCLvy9Z6k.33yC3x9jCkPgTA/YwjB7MS",2, "bnaya","brown", "Tel aviv", "Jabotinsky");

-- create table productCategory (
-- 	id int auto_increment not null,
--     category varchar(50),
--     primary key (id) 
-- );

-- insert into productCategory (category)
-- values ("Food"),("Treats"),("toys"),("Care"),("Beds"),("Collors & Leashes"),("Food Bowls"); 

-- create table product (
-- 	id int auto_increment not null,
--     product varchar(50),
--     category_id int,
--     price int,
--     image varchar(255),
--     primary key (id),
--     foreign key (category_id) references productCategory(id)
-- );

-- insert into product (product, category_id, price, image)
-- values ("Hill's Science Diet Puppy",1, 200, "https://www.animalshop.co.il/images/itempics/052742038599_15112020143505_large.jpg"),
-- ("Purina Pro Plan Puppy ",1, 119, "https://www.petbest.co.il/wp-content/uploads/2018/06/01-small-mini-puppy-chicken.png"),
-- ("Semi Moist",2, 39, "https://d3m9l0v76dty0.cloudfront.net/system/photos/3804786/large/04b64c198853e25101e7d88fb9326e85.jpg"),
-- ("Puppy Snack",2, 35, "https://d3m9l0v76dty0.cloudfront.net/system/photos/2935685/large/efb4177e0caa8bd768efb08d5656e872.jpg"),
-- ("Calcium Milk Bone",2, 50, "https://d3m9l0v76dty0.cloudfront.net/system/photos/2930209/large/20a4475bbc0f7f705a83116e1a2efb6e.jpg"),
-- ("KONG Puppy",3, 35, "https://d3m9l0v76dty0.cloudfront.net/system/photos/5234874/large/b91d639eba97c631c7fb14cec395d70e.jpg"),
-- ("Tug Toy",3, 85, "https://d3m9l0v76dty0.cloudfront.net/system/photos/5378053/extra_large/6ce0002f3355a30988f9d508ce243428.jpg"),
-- ("Pets Project",3, 35, "https://d3m9l0v76dty0.cloudfront.net/system/photos/4999186/extra_large/18f98541cb1dd08662a11631a04cfa91.jpg"),
-- ("Espree",4, 79, "https://d3m9l0v76dty0.cloudfront.net/system/photos/4408654/extra_large/57a4fbe20d315756c97a22c650f9cb1f.jpg"),
-- ("Home Guard",4, 69, "https://d3m9l0v76dty0.cloudfront.net/system/photos/5526722/extra_large/cec9d642dd2b9995a87ba7ff9ec261ea.jpg"),
-- ("Fur Comb",4, 67, "https://d3m9l0v76dty0.cloudfront.net/system/photos/4175602/extra_large/ab8bfefdb8dd981bcd90ecf589ec6b6e.jpg"),
-- ("Plastic Bed",5, 50, "https://d3m9l0v76dty0.cloudfront.net/system/photos/6049250/extra_large/4cc6d9499aa3f41d5ac8690dcfefc2f6.jpg"),
-- ("Mattress",5, 110, "https://d3m9l0v76dty0.cloudfront.net/system/photos/4378848/extra_large/3761acac2fd913265c23a35620643d3f.jpg"),
-- ("Bed",5, 100, "https://d3m9l0v76dty0.cloudfront.net/system/photos/5252631/extra_large/ceb584075ec874ff330af3c69241a631.jpg"),
-- ("Training Leash",6, 60, "https://d3m9l0v76dty0.cloudfront.net/system/photos/4085908/extra_large/fb4276fb5a972727a5a271af7b6e2bb2.jpg"),
-- ("Collar",6, 20, "https://d3m9l0v76dty0.cloudfront.net/system/photos/4890967/extra_large/be9ef412a3475846f6d544c2da79cc9e.jpg"),
-- ("Petler Herness",6, 35, "https://d3m9l0v76dty0.cloudfront.net/system/photos/4635611/extra_large/b84741efaf2d9a954ec04a45658e86de.jpg"),
-- ("L Bowl",7, 45, "https://d3m9l0v76dty0.cloudfront.net/system/photos/5504637/extra_large/d9f88ce5ab71f81c81c6368cd1d201b9.jpg"),
-- ("S Bowl",7, 40, "https://d3m9l0v76dty0.cloudfront.net/system/photos/4113773/extra_large/36023624aa55d8d1336a4038eef7d2e6.jpg"),
-- ("2 Bowls With Stand",7, 40, "https://d3m9l0v76dty0.cloudfront.net/system/photos/5617372/extra_large/2711d0fecdb39cdb9314bfe21c8fdd9d.jpg");

-- create table cart (
-- 	id int auto_increment not null,
--     user_id int,
--     create_date date,
-- 	statuse boolean default false,
--     primary key (id),
--     foreign key (user_id) references user(id)
-- );

-- insert into cart (user_id, create_date) values (2, "2021-01-15");

-- create table cartItem (
-- 	id int auto_increment not null,
--     product_id int,
--     product_amount int,
--     product_total_price int,
--     cart_id int,
--     primary key (id),
--     foreign key (product_id) references product(id),
--     foreign key (cart_id) references cart(id)
-- );

-- insert into cartItem (product_id, product_amount, product_total_price, cart_id)
-- values (1, 1, 200, 1);

-- create table shopOrder (
-- 	id int auto_increment not null,
--     user_id int,
--     cart_id int,
--     order_total_price int,
--     city varchar(50),
--     street varchar(50),
--     delivery_data date,
--     closing_date date,
--     credit_card int,
--     primary key (id),
--     foreign key (user_id) references user(id),
--     foreign key (cart_id) references cart(id)
-- );

-- insert into shopOrder (user_id, cart_id, order_total_price, city, street, delivery_data, closing_date, credit_card)
-- values (2, 1, 200, "Tel aviv", "Jabotinsky", "2021-01-23", "2021-01-20", 1234);