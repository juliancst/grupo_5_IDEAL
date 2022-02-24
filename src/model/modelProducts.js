const path = require("path");
const fs = require("fs");
<<<<<<< HEAD
const db = require("../database/models")



const controller = {
    bdProducts : async () => {
        try {
            let all = await db.products.findAll({
                include : [
                    {association: "products_has_activities"},
                    {association: "products_has_lines"},
                    {association: "products_has_materials"},
                    {association: "products_has_subactivities"},
                    {association: "products_has_techniques"},
                ]
            });
            return all;
        } catch (error) {
            console.log(`El error es ${error}`)
        }
    },

    findProductById : async (id) => {
        try {
            const product = await db.products.findByPk(id);
            return product
        } catch (error) {
            console.log(`El error es ${error}`)
        }
    },
    product : async function (parametros) {
        try {
            const product = await this.findProductById(parametros.id);
            return product;
        } catch (error) {
            console.log(error)
        }
    },

    adminStore : async (body, image) => {
        try {
            db.products.create({
                fullname : body.fullName,
                price : body.price,
                image : image.filename,
                
            },{
                include : [
                    {association: "products_has_activities"},
                    {association: "products_has_lines"},
                    {association: "products_has_materials"},
                    {association: "products_has_subactivities"},
                    {association: "products_has_techniques"}
                ]
            })
        } catch (error) {
            console.log(`El error es ${error}`)
        }
    },

    adminEdit : function (parametros) {
        const productEdit = this.findProductById(parametros.id);
        return productEdit;
    },

    adminModified : async (parametros, body, image) => {
        try {
            let product = db.products.update({
                fullname : body.fullName,
                price : body.price,
                image : image.filename
            },
            {
                where: {id : parametros.id}
            });
            return product;
        } catch (error) {
            console.log(`El error es ${error}`)
        }
    },

    adminDelete : function (parametros) {  
        const productToDelete = this.findProductById(parametros.id);
        let rutaImage = path.resolve(__dirname, "../public/img/products_image/" + productToDelete[0].image);
        fs.unlinkSync(rutaImage);
        const data = this.bdProducts().filter(products =>{
            return products.id != parametros.id;
        });
        this.writeInDatabase(data);
=======
const {
  activities,
  materials,
  products,
  lines,
  subactivities,
  techniques,
} = require("../database/models");

// const sequelize = db.sequelize

const controller = {
  bdProducts: async function () {
    try {
      const Allproducts = await products.findAll({
        include: [
          "line",
          "material_id_materials",
          "activity_id_activities",
          "subactivity_id_subactivities",
          "technique_id_techniques",
        ],
      });

      Allproducts.forEach((element) => {});
      return Allproducts;
    } catch (error){
      console.log(`ocurrio un error ${error.message}`);
>>>>>>> ccd876aeb9570d03778c7c8aa2174fcb4f73db23
    }
  },
  findProductById: async function (parametros) {
    try {
      const product = await products.findByPk(parametros.id, {
        include: [
          "line",
          "material_id_materials",
          "activity_id_activities",
          "subactivity_id_subactivities",
          "technique_id_techniques",
        ],
      });

      return product;
    } catch (error) {
      console.log(`ocurrio un error ${error.message}`);
    }
  },
  productsByLine: async function (line) {
    try {
      const product = await products.findAll({
        where: {
          line_id: line,
        },
      });
    } catch (error) {
      console.log(`ocurrio un error ${error.message}`);
    }
  },

  addProduct: async function (body, image) {
    try {
      const {
        price,
        fullName,
        productLine,
        material,
        activity,
        subactivity,
        technique,
        ...all
      } = body;

      const newProduct = {
        ...all,
        fullname: fullName,
        price: price,
        line_id: productLine,
        image: image.filename,
      };

      const product = await products.create(newProduct, {
        include: [
          "line",
          "material_id_materials",
          "activity_id_activities",
          "subactivity_id_subactivities",
          "technique_id_techniques",
        ],
      });

      await product.addMaterial_id_materials(material);
      await product.addActivity_id_activities(activity);
      await product.addSubactivity_id_subactivities(subactivity);
      await product.addTechnique_id_techniques(technique);
      
    } catch (error) {
      console.log(`ocurrio un error ${error.message}`);
    }
  },
  adminEdit: async function (parametros) {
    try {
      const productEdit = this.findProductById(parametros);
      const findLine = lines.findAll();
      const findActivity = activities.findAll();
      const findSubactivity = subactivities.findAll();
      const findTechnique = techniques.findAll();
      const findMaterial = materials.findAll();

      const AllPromise = [
        productEdit,
        findLine,
        findActivity,
        findSubactivity,
        findTechnique,
        findMaterial,
      ];
      const result = await Promise.all(AllPromise);

      return result;
    } catch (error) {
      console.log(`ocurrio un error ${error.message}`);
    }
  },
  adminModified: async function (parametros, body, image) {
    try {
      const {
        fullName,
        price,
        productLine,
        material,
        activity,
        subactivity,
        technique,
        ...all
      } = body;

      let foundProduct = await this.findProductById(parametros);


      console.log(foundProduct.material_id_materials[0]._options)

      const imageFile = image == undefined ? foundProduct.image : image.filename;

    
      const productEdit = {
        ...all,
        fullname: fullName,
        price: Number(price),
        image: imageFile,
        line_id: Number(productLine)
      };


      if (image != undefined) {
        let rutaImage = path.resolve(
          __dirname,
          "../public/img/products_image/" + foundProduct.image
        );
        fs.unlinkSync(rutaImage);
      }

      const product = await foundProduct.update(productEdit, {
        where: {
          product_id: parametros.id
        }
      });

      await product.setMaterial_id_materials(material);
      await product.setActivity_id_activities(activity);
      await product.setSubactivity_id_subactivities(subactivity);
      await product.setTechnique_id_techniques(technique);


    } catch (error) {
      console.log(`ocurrio un error ${error.message}`);
    }
    },  
  adminDelete: async function (parametros) {
    try {
      const foundProduct = await this.findProductById(parametros);

      await foundProduct.setMaterial_id_materials([]);
      await foundProduct.setActivity_id_activities([]);
      await foundProduct.setSubactivity_id_subactivities([]);
      await foundProduct.setTechnique_id_techniques([]);

      let rutaImage = path.resolve(
        __dirname,
        "../public/img/products_image/" + foundProduct.image
      );
      fs.unlinkSync(rutaImage);

      await foundProduct.destroy();
    } catch (error) {
      console.log(`ocurrio un error ${error.message}`);
    }
  },
};


module.exports = controller;
