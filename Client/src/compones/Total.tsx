import React from "react";
import  CustomerForm  from "./cutomer"; // Assuming the file name is "CustomerForm.js"
import { trpc } from "../trpc";

function ParentComponent() {
  // Your code for totalAmount and trpc

  return (
    <div>
   
      <CustomerForm totalAmount={100} trpc={trpc} />
      
    </div>
  );
}

export default ParentComponent;
