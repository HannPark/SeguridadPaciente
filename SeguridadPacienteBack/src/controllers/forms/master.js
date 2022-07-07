/* eslint-disable camelcase */
const moment = require("moment");
const { Op } = require("sequelize");
const EmpresasModel = require("../../models/combos/empresas");
const SedesModel = require("../../models/combos/sedes");
const ServiciosModel = require("../../models/combos/servicios");
const TiposIdModel = require("../../models/combos/tiposId");
const TiposNovedadModel = require("../../models/combos/tiposNovedad");
const OportunidadesMejoraModel = require("../../models/forms/oportunidadesMejora");
const MasterModel = require("../../models/forms/master");

// #### OPORTUNIDADES DE MEJORA ####
exports.createMejora = async (req, res) => {
  const {
    Id_Master,
    Codigo_Externo,
    Descripcion,
    Responsable,
  } = req.body;
  try {
    const entry = [];
    if (Codigo_Externo.length === Descripcion.length) {
      for (let i = 0; i < Descripcion.length; i += 1) {
        entry[i] = {
          Id_Master,
          Codigo_Externo: Codigo_Externo[i],
          Descripcion: Descripcion[i],
          Responsable: Responsable[i],
        };
      }
      const data = await OportunidadesMejoraModel.bulkCreate(entry);
      return res.status(200).json(data);
    }
    return res.status(503).send("Campos Faltantes");
  } catch (err) {
    return res.status(503).send(`No fue posible guardar el registro: ${err}`);
  }
};

exports.getMejora = async (req, res) => {
  const { Id_Master } = req.body;
  try {
    const data = await OportunidadesMejoraModel.findAll({
      where: { Id_Master, Estado: "ACT" },
      order: [["Codigo_Externo", "ASC"]],
    });
    return res.status(200).json(data);
  } catch (err) {
    return res.status(503).send(`No fue posible consultar los registros: ${err.message}`);
  }
};

exports.updateMejora = async (req, res) => {
  const { Id, Porcentaje_Mejora } = req.body;
  try {
    await OportunidadesMejoraModel.update({
      Porcentaje_Mejora,
    }, {
      where: { Id },
    });
    return res.status(200).json({ message: "Registro Actualizado" });
  } catch (err) {
    return res.status(503).send(`No fue posible actualizar el registro: ${err.message}`);
  }
};
// #### FIN OPORTUNIDADES DE MEJORA ####

// #### FORMULARIO MASTER ####
exports.createEntry = async (req, res) => {
  const entry = { ...req.body };
  // console.log("IMAGEN:::", entry.Imagen_Archivo);
  if (entry.Imagen_Archivo) {
    delete entry.Imagen_Evidencia;
  }
  try {
    await MasterModel.create(entry);
    return res.status(200).json({ message: "Registro Creado" });
  } catch (err) {
    // Implementar Error Responses
    return res.status(503).send(`No fue posible guardar el registro: ${err.message}`);
  }
  // next();
};

exports.getAnswers = async (req, res) => {
  const {
    Id, Numero_Id, Start_Date, End_Date, Tipo_Novedad, Empresa, Sede,
  } = req.body;
  try {
    const answers = await MasterModel.findAll({
      where: {
        [Op.or]: [
          { Id },
          { Numero_Id },
          {
            Fecha_Incidente: {
              [Op.gte]: Start_Date,
              [Op.lte]: End_Date || moment().format("YYYY-MM-DD"),
              // [Op.between]: [`${Start_Date}T00:00.000Z`, `${End_Date}T23:59.000Z`],
            },
          },
          { Tipo_Novedad },
          { Empresa },
          { Sede },
        ],
      },
      order: [["Fecha_Incidente", "ASC"]],
      include: [{
        model: TiposNovedadModel,
        as: "Tipo_Novedad_Join",
        where: { Estado: "ACT" },
        attributes: ["Descripcion"],
      }, {
        model: EmpresasModel,
        as: "Empresa_Join",
        where: { Estado: "ACT" },
        attributes: ["Nombre"],
      }, {
        model: SedesModel,
        as: "Sede_Join",
        where: { Estado: "ACT" },
        attributes: ["Nombre"],
      }, {
        model: TiposIdModel,
        as: "Tipo_Id_Join",
        where: { Estado: "ACT" },
        attributes: ["Descripcion"],
      }, {
        model: ServiciosModel,
        as: "Servicio_Id_Join",
        where: { Estado: "ACT" },
        attributes: ["Descripcion"],
      }],
    });
    return res.status(200).json(answers);
  } catch (err) {
    // Implementar Error Responses
    return res.status(503).send("No fue posible consultar la tabla: ", err);
  }
};
