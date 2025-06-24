#!/usr/bin/env python3
import requests
import json
import unittest
import os
import time
from datetime import datetime

# Get the backend URL from the frontend .env file
with open('/app/frontend/.env', 'r') as f:
    for line in f:
        if line.startswith('REACT_APP_BACKEND_URL='):
            BACKEND_URL = line.strip().split('=')[1].strip('"\'')
            break

# Ensure the URL doesn't have quotes
if BACKEND_URL.startswith('"') and BACKEND_URL.endswith('"'):
    BACKEND_URL = BACKEND_URL[1:-1]
elif BACKEND_URL.startswith("'") and BACKEND_URL.endswith("'"):
    BACKEND_URL = BACKEND_URL[1:-1]

API_URL = f"{BACKEND_URL}/api"
print(f"Testing backend API at: {API_URL}")

class BackendAPITest(unittest.TestCase):
    """Test suite for the backend API endpoints"""
    
    def setUp(self):
        """Set up test fixtures"""
        self.headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
        # Generate a unique identifier for test data
        self.test_id = f"test_{int(time.time())}"
        
    def test_01_health_check(self):
        """Test the health check endpoint"""
        print("\n=== Testing Health Check API ===")
        response = requests.get(f"{API_URL}/health")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['status'], 'healthy')
        self.assertEqual(data['database'], 'connected')
        self.assertIn('timestamp', data)
        print("✅ Health check API is working correctly")
        
    def test_02_contact_form_valid_data(self):
        """Test the contact form API with valid data"""
        print("\n=== Testing Contact Form API with valid data ===")
        contact_data = {
            "name": f"Test User {self.test_id}",
            "email": f"test.user{self.test_id}@example.com",
            "service": "Academic Writing",
            "message": "This is a test message for the contact form API test."
        }
        
        response = requests.post(
            f"{API_URL}/contact",
            headers=self.headers,
            json=contact_data
        )
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['status'], 'success')
        self.assertIn('id', data)
        self.assertIn('message', data)
        self.contact_id = data['id']  # Save for later tests
        print(f"✅ Contact form API accepted valid data (ID: {self.contact_id})")
        
        # Verify the contact was saved by retrieving it
        get_response = requests.get(f"{API_URL}/contacts/{self.contact_id}")
        self.assertEqual(get_response.status_code, 200)
        contact = get_response.json()
        self.assertEqual(contact['name'], contact_data['name'])
        self.assertEqual(contact['email'], contact_data['email'])
        self.assertEqual(contact['service'], contact_data['service'])
        self.assertEqual(contact['message'], contact_data['message'])
        print("✅ Contact data was correctly saved to database")
        
    def test_03_contact_form_invalid_email(self):
        """Test the contact form API with invalid email"""
        print("\n=== Testing Contact Form API with invalid email ===")
        contact_data = {
            "name": "Test User",
            "email": "invalid-email",  # Invalid email format
            "service": "Technical Writing",
            "message": "This is a test message with invalid email."
        }
        
        response = requests.post(
            f"{API_URL}/contact",
            headers=self.headers,
            json=contact_data
        )
        
        self.assertEqual(response.status_code, 422)  # Validation error
        print("✅ Contact form API correctly rejected invalid email")
        
    def test_04_contact_form_missing_fields(self):
        """Test the contact form API with missing required fields"""
        print("\n=== Testing Contact Form API with missing fields ===")
        contact_data = {
            "name": "Test User",
            # Missing email field
            "service": "Content & Editing"
            # Missing message field
        }
        
        response = requests.post(
            f"{API_URL}/contact",
            headers=self.headers,
            json=contact_data
        )
        
        self.assertEqual(response.status_code, 422)  # Validation error
        print("✅ Contact form API correctly rejected missing fields")
        
    def test_05_get_services(self):
        """Test the services API"""
        print("\n=== Testing Services API ===")
        response = requests.get(f"{API_URL}/services")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn('services', data)
        services = data['services']
        self.assertIsInstance(services, list)
        self.assertTrue(len(services) > 0)
        
        # Verify service structure
        for service in services:
            self.assertIn('id', service)
            self.assertIn('name', service)
            self.assertIn('description', service)
            self.assertIn('features', service)
            self.assertIsInstance(service['features'], list)
            
        print(f"✅ Services API returned {len(services)} services with correct structure")
        
    def test_06_get_stats(self):
        """Test the portfolio stats API"""
        print("\n=== Testing Portfolio Stats API ===")
        response = requests.get(f"{API_URL}/stats")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        
        # Verify stats structure
        required_fields = [
            'total_contacts', 'new_contacts', 'in_progress', 
            'completed_projects', 'recent_contacts', 
            'experience_years', 'success_rate'
        ]
        
        for field in required_fields:
            self.assertIn(field, data)
            
        # Verify numeric fields are integers
        numeric_fields = [
            'total_contacts', 'new_contacts', 'in_progress', 
            'completed_projects', 'recent_contacts', 'experience_years'
        ]
        
        for field in numeric_fields:
            self.assertIsInstance(data[field], int)
            
        print("✅ Portfolio Stats API returned data with correct structure")
        
    def test_07_get_contacts(self):
        """Test the get contacts API"""
        print("\n=== Testing Get Contacts API ===")
        response = requests.get(f"{API_URL}/contacts")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        
        self.assertIn('contacts', data)
        self.assertIn('total', data)
        self.assertIn('skip', data)
        self.assertIn('limit', data)
        
        contacts = data['contacts']
        self.assertIsInstance(contacts, list)
        
        if len(contacts) > 0:
            # Verify contact structure
            contact = contacts[0]
            self.assertIn('id', contact)
            self.assertIn('name', contact)
            self.assertIn('email', contact)
            self.assertIn('service', contact)
            self.assertIn('message', contact)
            self.assertIn('status', contact)
            
        print(f"✅ Get Contacts API returned {len(contacts)} contacts with correct structure")
        
    def test_08_update_contact_status(self):
        """Test updating contact status"""
        # First create a contact to update
        print("\n=== Testing Update Contact Status API ===")
        contact_data = {
            "name": f"Status Test User {self.test_id}",
            "email": f"status.test{self.test_id}@example.com",
            "service": "Technical Writing",
            "message": "This is a test message for the status update test."
        }
        
        # Create contact
        response = requests.post(
            f"{API_URL}/contact",
            headers=self.headers,
            json=contact_data
        )
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        contact_id = data['id']
        
        # Update status
        update_response = requests.put(
            f"{API_URL}/contacts/{contact_id}/status?status=in_progress",
            headers=self.headers
        )
        
        self.assertEqual(update_response.status_code, 200)
        update_data = update_response.json()
        self.assertEqual(update_data['status'], 'in_progress')
        
        # Verify status was updated
        get_response = requests.get(f"{API_URL}/contacts/{contact_id}")
        self.assertEqual(get_response.status_code, 200)
        contact = get_response.json()
        self.assertEqual(contact['status'], 'in_progress')
        
        print("✅ Contact status update API is working correctly")
        
    def test_09_invalid_contact_id(self):
        """Test retrieving a contact with an invalid ID"""
        print("\n=== Testing Invalid Contact ID ===")
        response = requests.get(f"{API_URL}/contacts/invalid-id-that-doesnt-exist")
        self.assertEqual(response.status_code, 404)
        print("✅ API correctly returns 404 for non-existent contact")

if __name__ == '__main__':
    unittest.main(verbosity=2)