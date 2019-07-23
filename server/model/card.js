import {Schema} from "mongoose";

const CardSchema = new Schema({
    card_name:{
        type:String,
        required:[true, "Name is required"]
    }
});