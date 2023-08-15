import express from 'express';
import { extractToken, verifyToken } from '../security/jwtUtils.js';
import InvoiceModel from '../models/Invoice.js';
import { createInvoice, generateInvoiceData, loadBooking, loadClient } from '../middlewares/InvoiceCreation.js';
import { BookingModel } from '../models/Booking.js';
import ClientModel from '../models/Client.js';
import { checkAdminRole, checkAdvancedUserRole } from '../middlewares/UserMiddelwares.js';


const invoiceRouter = express.Router();

//generate new invoice

invoiceRouter.post("/",extractToken, verifyToken, checkAdvancedUserRole, loadBooking, loadClient, generateInvoiceId, generateInvoiceData, createInvoice, async(req, res ) => {
    try {
        const booking = req.booking;

        //invoice status updated to 1, which means that an invoice for this booking is generated
        const update = {invoiceStatus: 1};
        await booking.updateOne(update);   
        
        res.send(req.binaryFile);
        
    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
    
})



//get all invoices
invoiceRouter.get("/",extractToken, verifyToken, async(req, res) => {
    try {

        const invoices = await InvoiceModel.find();
        res.json(invoices);
    } catch(err) {
        console.log(err);
        res.sendStatust(500);
    }
})



//get invoice by invoiceId
invoiceRouter.get("/invoiceId/:invoiceId",extractToken, verifyToken, async(req, res) => {

    try {

        const invoice = await InvoiceModel.findOne({invoiceId: req.params.invoiceId});
        res.json(invoice);
    } catch(err) {
        res.sendStatus(500);
    }
});



//get invoice by bookingId
invoiceRouter.get("/:booking",extractToken, verifyToken, async(req, res) => {
    try {

        const invoice = await InvoiceModel.findOne({booking: req.params.booking});


        if(invoice) res.json(invoice);
        else res.json({});
    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
})



invoiceRouter.get("/booking/:clientId",extractToken, verifyToken, async(req, res) => {

    try {

        const booking = await BookingModel.findOne({clientId: req.params.clientId});
        if(booking) res.json(booking);
        else res.json({});
    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
});


invoiceRouter.delete("/all",extractToken, verifyToken, checkAdminRole, async(req, res) => {

    try {
        await InvoiceModel.deleteMany();
        res.sendStatus(200);
    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
});

async function generateInvoiceId(req, res, next) {

    try {

        if(req.booking.invoiceStatus !== 0) {
            const invoice = await InvoiceModel.findOne({
                booking: req.booking._id
            });
            req.invoiceId = invoice.invoiceId;

            await InvoiceModel.deleteOne({booking: req.booking._id});
        }
        else {
            const invoices = (await InvoiceModel.find()).reverse();
            if(invoices.length > 0) {
                req.invoiceId = invoices[0].invoiceId + 1
            } else {
        
                req.invoiceId = 50000001;
            
            }
        }
        
    
        return next();
    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
    
}

export default invoiceRouter;