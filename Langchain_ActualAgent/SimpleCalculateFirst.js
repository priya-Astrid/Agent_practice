import { tool } from "langchain";
import z from "zod";;

const add = ({ a, b }) => {
  return a + b;
};

const multiply = ({ a, b }) => {
  return a * b;
};
const substract = ({ a, b }) => {
  return a - b;
};

const calculate =  tool(add,{
    name: "addition",
    description:"use this tools when add two number",
    schema:z.object({
        a: z.number().describe("first number"),
        b: z.number().describe("second number")
    })
})

const multiplication = tool(multiply,{
    name:"multiply",
    description:""
})