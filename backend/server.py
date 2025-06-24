from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from motor.motor_asyncio import AsyncIOMotorClient
import os
from datetime import datetime
import uuid
from typing import Optional
import asyncio

# Initialize FastAPI app
app = FastAPI(title="Professional Writing Services API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database connection
MONGO_URL = os.environ.get("MONGO_URL", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGO_URL)
db = client.writing_portfolio

# Data models
class ContactForm(BaseModel):
    name: str
    email: EmailStr
    service: str
    message: str

class ContactResponse(BaseModel):
    id: str
    name: str
    email: str
    service: str
    message: str
    created_at: datetime
    status: str = "new"

# Database collections
contacts_collection = db.contacts

@app.on_event("startup")
async def startup_event():
    """Initialize database and create indexes"""
    try:
        # Test database connection
        await client.admin.command('ping')
        print("Connected to MongoDB successfully")
        
        # Create indexes for better performance
        await contacts_collection.create_index("email")
        await contacts_collection.create_index("created_at")
        print("Database indexes created successfully")
        
    except Exception as e:
        print(f"Database connection error: {e}")

@app.on_event("shutdown")
async def shutdown_event():
    """Close database connection"""
    client.close()

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Professional Writing Services API",
        "version": "1.0.0",
        "services": [
            "Academic Writing",
            "Technical Writing", 
            "Content & Editing",
            "Cryptocurrency Whitepapers"
        ]
    }

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    try:
        # Test database connection
        await client.admin.command('ping')
        return {
            "status": "healthy",
            "database": "connected",
            "timestamp": datetime.utcnow()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail="Database connection failed")

@app.post("/api/contact")
async def submit_contact_form(contact: ContactForm):
    """Submit contact form"""
    try:
        # Create contact document
        contact_doc = {
            "id": str(uuid.uuid4()),
            "name": contact.name,
            "email": contact.email,
            "service": contact.service,
            "message": contact.message,
            "created_at": datetime.utcnow(),
            "status": "new"
        }
        
        # Insert into database
        result = await contacts_collection.insert_one(contact_doc)
        
        if result.inserted_id:
            return {
                "message": "Contact form submitted successfully",
                "id": contact_doc["id"],
                "status": "success"
            }
        else:
            raise HTTPException(status_code=500, detail="Failed to save contact form")
            
    except Exception as e:
        print(f"Error submitting contact form: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/api/contacts")
async def get_contacts(skip: int = 0, limit: int = 100):
    """Get all contact submissions (admin endpoint)"""
    try:
        # Get contacts with pagination
        cursor = contacts_collection.find().sort("created_at", -1).skip(skip).limit(limit)
        contacts = await cursor.to_list(length=limit)
        
        # Convert ObjectId to string and format response
        formatted_contacts = []
        for contact in contacts:
            contact["_id"] = str(contact["_id"])
            formatted_contacts.append(contact)
        
        # Get total count
        total_count = await contacts_collection.count_documents({})
        
        return {
            "contacts": formatted_contacts,
            "total": total_count,
            "skip": skip,
            "limit": limit
        }
        
    except Exception as e:
        print(f"Error getting contacts: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/api/contacts/{contact_id}")
async def get_contact(contact_id: str):
    """Get specific contact by ID"""
    try:
        contact = await contacts_collection.find_one({"id": contact_id})
        
        if not contact:
            raise HTTPException(status_code=404, detail="Contact not found")
        
        # Convert ObjectId to string
        contact["_id"] = str(contact["_id"])
        
        return contact
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error getting contact: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.put("/api/contacts/{contact_id}/status")
async def update_contact_status(contact_id: str, status: str):
    """Update contact status"""
    try:
        valid_statuses = ["new", "in_progress", "completed", "archived"]
        if status not in valid_statuses:
            raise HTTPException(
                status_code=400, 
                detail=f"Invalid status. Must be one of: {', '.join(valid_statuses)}"
            )
        
        result = await contacts_collection.update_one(
            {"id": contact_id},
            {"$set": {"status": status, "updated_at": datetime.utcnow()}}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Contact not found")
        
        return {
            "message": "Contact status updated successfully",
            "id": contact_id,
            "status": status
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error updating contact status: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/api/services")
async def get_services():
    """Get available writing services"""
    services = [
        {
            "id": "academic-writing",
            "name": "Academic Writing",
            "description": "Comprehensive academic writing services including thesis, proposals, dissertations, and research papers.",
            "features": [
                "Thesis & Dissertations",
                "Research Proposals", 
                "Academic Assignments",
                "Literature Reviews",
                "All Referencing Styles"
            ],
            "pricing": "Contact for quote"
        },
        {
            "id": "technical-writing",
            "name": "Technical Writing",
            "description": "Professional technical documentation and specialized content creation for various industries.",
            "features": [
                "Cryptocurrency Whitepapers",
                "Technical Documentation",
                "User Manuals",
                "API Documentation",
                "Industry Reports"
            ],
            "pricing": "Contact for quote"
        },
        {
            "id": "content-editing",
            "name": "Content & Editing",
            "description": "Expert editing and content creation services for websites, blogs, and marketing materials.",
            "features": [
                "Website Content",
                "Blog Articles",
                "Copy Editing",
                "Proofreading",
                "SEO-Optimized Content"
            ],
            "pricing": "Contact for quote"
        }
    ]
    
    return {"services": services}

@app.get("/api/stats")
async def get_stats():
    """Get portfolio statistics"""
    try:
        # Get total contacts
        total_contacts = await contacts_collection.count_documents({})
        
        # Get contacts by status
        new_contacts = await contacts_collection.count_documents({"status": "new"})
        in_progress = await contacts_collection.count_documents({"status": "in_progress"})
        completed = await contacts_collection.count_documents({"status": "completed"})
        
        # Get recent contacts (last 30 days)
        thirty_days_ago = datetime.utcnow().replace(day=1)  # Simplified for demo
        recent_contacts = await contacts_collection.count_documents({
            "created_at": {"$gte": thirty_days_ago}
        })
        
        return {
            "total_contacts": total_contacts,
            "new_contacts": new_contacts,
            "in_progress": in_progress,
            "completed_projects": completed,
            "recent_contacts": recent_contacts,
            "experience_years": 5,
            "success_rate": "100%"
        }
        
    except Exception as e:
        print(f"Error getting stats: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)