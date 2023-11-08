import express from "express";
import pkg from "@prisma/client";
import morgan from "morgan";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

const { PrismaClient } = pkg;
const prisma = new PrismaClient();  

// Get all reviews
app.get("/reviews", async (req, res) => {
    const reviews = await prisma.Reviewtb.findMany();
    res.json(reviews);
  });

// Get a review by name 
app.get("/reviews/:name", async (req, res) => {
    const name = req.params.name; 
    const review = await prisma.Reviewtb.findUnique({
      where: { 
        name: name
      },
    }); 
    res.json(review);
  });  

// Create a review 
app.post("/review", async (req, res) => {
    const { name, rate, review } = req.body; 
    const rateInt = parseInt(rate, 10); 
    if (isNaN(rateInt) || rateInt < 1 || rateInt > 5){ 
      return res.status(400).json({ error: "Rate must be between 1 and 5" });
    }
    const reviewItem = await prisma.Reviewtb.create({
      data: {
        name,
        rate: rateInt,
        review
      },
    });
    res.json(reviewItem);
  }); 

// Update a review by name
app.put("/reviews/:name", async (req, res) => {
    const name = req.params.name;  
    const {review} = req.body; 
    const reviewItem = await prisma.Reviewtb.update({
      where: { 
        name: name
      }, 
      data: { 
        review: review
      },
    });
    res.json(reviewItem);
  }); 

// Delete a review by name  
app.delete("/reviews/:name", async (req, res) => {
    const name = req.params.name; 
    const reviewItem = await prisma.Reviewtb.delete({
      where: { 
        name: name,
      },
    });
    res.json(reviewItem);
  });

app.listen(8000, () => {
console.log("Server running on http://localhost:8000 🎉 🚀");
});