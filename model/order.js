const { ObjectId } = require("mongodb");
const database = require("../config/db");

class Orders {
  static async newOrders(
    userId,
    packetId,
    address,
    phoneNumber,
    nameHusband,
    nameWife,
    dateOfMerried
  ) {
    const id = new ObjectId(packetId);
    const packet = await database.collection("Packages").findOne({ _id: id });
    const newOrders = database.collection("Orders").insertOne({
      UserId: userId,
      PacketId: packetId,
      status: "false",
      price: packet.price,
      Profile: {
        nameHusband: nameHusband,
        nameWife: nameWife,
        address: address,
        phoneNumber: phoneNumber,
        dateOfMerried: dateOfMerried,
      },
    });
    const result = database
      .collection("Orders")
      .findOne((await newOrders).insertedId);
    return result;
  }
  static async ordersById(_id) {
    return await database.collection("Orders").findOne(_id);
  }
  static async allOrders() {
    return await database.collection("Orders").find({}).toArray();
  }
  static async updateOrders(
    orderId,
    address,
    phoneNumber,
    nameHusband,
    nameWife,
    dateOfMerried
  ) {
    const id = new ObjectId(orderId);
    const order = await database.collection("Orders").updateOne(
      { _id: id },
      {
        $set: {
          address: address,
          phoneNumber: phoneNumber,
          nameHusband: nameHusband,
          nameWife: nameWife,
          dateOfMarried: dateOfMerried,
        },
      }
    );
    return order;
  }
  static async findOrderById(orderId) {
    const id = new ObjectId(orderId);
    return await database.collection("Orders").findOne({ _id: id });
  }

  static async destroyOrders(orderId) {
    const id = new ObjectId(orderId);
    return await database.collection("Orders").deleteOne({ _id: id });
  }
  static async getTotalPrice() {
    const allOrders = await database.collection("Orders").find({}).toArray();

    const result = allOrders.reduce((total, order) => {
      return total + parseInt(order.price);
    }, 0);

    const formattedResult = result.toLocaleString("id-ID", { currency: "IDR" });

    return formattedResult;
  }
  static async finOrders() {
    return database.collection("Orders").find({}).toArray();
  }
}
module.exports = Orders;
