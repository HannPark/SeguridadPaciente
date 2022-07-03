/* eslint-disable camelcase */
const { sequelize } = require("../../models/forms/detalles");
const DetallesModel = require("../../models/forms/detalles");
const MasterModel = require("../../models/forms/master");

exports.createDetail = async (req, res) => {
  const entry = { ...req.body };
  try {
    const regExistente = await DetallesModel.findOne({
      where: { Id_Master: entry.Id_Master, Estado: "ACT" },
    });
    if (!regExistente) {
      const result = await DetallesModel.create(entry);
      await MasterModel.update({
        Id_Detalle: result.Id,
        Estado_Proceso: 2,
        Fecha_Modificacion: sequelize.literal("getdate()"),
      }, {
        where: { Id: entry.Id_Master },
      });
      return res.status(200).json(result);
    }
    return res.status(503).send("No fue posible guardar el detalle ya que existe uno activo");
  } catch (err) {
    // Implementar Error Responses
    return res.status(503).send(`No fue posible guardar el detalle: , ${err.message}`);
  }
};

exports.getDetail = async (req, res) => {
  const { Id } = req.body;
  try {
    const data = await DetallesModel.findOne({
      where: { Id, Estado: "ACT" },
    });
    return res.status(200).json(data);
  } catch (err) {
    // Implementar Error Responses
    return res.status(503).send("No fue posible consultar la tabla:", err);
  }
};

exports.deleteDetail = async (req, res) => {
  const { Id } = req.body;
  try {
    const data = await DetallesModel.findOne({
      where: { Id, Estado: "ACT" },
    });
    if (data) {
      data.update({ Estado: "INA", Fecha_Modificacion: sequelize.literal("getdate()") });
      return res.status(200).json({ message: "Registro eliminado" });
    }
    return res.status(200).json({ message: "No hay registros para eliminar" });
  } catch (error) {
    return res.status(503).send("No fue posible consultar la tabla:", error);
  }
};
