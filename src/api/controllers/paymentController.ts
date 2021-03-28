import { Request, Response } from "express";
import Payment from "../methods/payment";
import * as mongoose from "mongoose";
import * as requestService from "../services/requestServices";
import { IPayment } from "../../schemas";

//GET all Payments
export let getAllPayments = (req: Request, res: Response) => {
    Payment.find((err: mongoose.Error, payments: any) => {
        if (err) {
            requestService.sendResponse(res, "error", 500, err)
        } else {
            requestService.sendResponse(res, "ok", 200, payments)
        };
    })
}

//GETs -> one Payment
export let getPayment = (req: Request, res: Response) => {
    Payment.findById(req.params.id, (err: mongoose.Error, payment: any) => {
        if (err) {
            requestService.sendResponse(res, "error", 500, err)
        } else {
            requestService.sendResponse(res, "ok", 200, payment)
        };
    })
}
//Gets payment with the highest invoicenumber
export let getHighestInvoice = async () => {
    return new Promise<any>(resolve => {
        Payment.find().sort({ invoiceno: -1 }).limit(1)
            .then((data: any) => {
                resolve(data);
            })
            .catch((err) => {
                resolve(null);
            });
    })
}

//Gets payment by PaymentId
export let getPaymentByPaymentId = (req: Request, res: Response) => {
    return new Promise<any>(resolve => {
        Payment.find({ paymentid: req.params.id })
            .then((data) => {
                resolve(data)
            })
            .catch((err) => {
                resolve(null)
            });
    })
}

//PUTs -> an new Payment into the table
export let addPayment = (payment) => {
    return new Promise<any>(resolve => {
        let addPayment = new Payment(payment);
        addPayment.save()
            .then((data) => {
                resolve(true);
            })
            .catch((err) => {
                resolve(false)
            });
    })
}
//DELETEs an Payment
export let deletePayment = (req: Request, res: Response) => {
    Payment.deleteOne({ _id: req.params.id })
        .then((data) => {
            requestService.sendResponse(res, "ok", 200, req.params.id)
        })
        .catch((err) => {
            requestService.sendResponse(res, "error", 500, err)
        });
}

//POST -> Updates an Payment
export let updatePayment = (req: Request, res: Response) => {
    Payment.findByIdAndUpdate(req.params.id, req.body, (err: mongoose.Error) => {
        if (err) {
            requestService.sendResponse(res, "error", 500, err)
        } else {
            getPayment(req, res);
        };
    })
}

//Function -> returns Payments
export let getManyPayments = (Ids: Array<mongoose.Types.ObjectId>) => {
    return new Promise<Array<IPayment>>(resolve => {
        let newArray = [];
        for (let i = 0; i < Ids.length; i++) {
            newArray.push(Ids[i])
        }
        let searchparam = { '_id': { $in: newArray } }
        Payment.find(
            searchparam, (err: mongoose.Error, payments: Array<IPayment>) => {
                if (err) {
                    console.log('err', err);
                    resolve([]);//correct error handling
                } else {
                    resolve(payments);
                };
            })
    })
}

export default getPayment;
