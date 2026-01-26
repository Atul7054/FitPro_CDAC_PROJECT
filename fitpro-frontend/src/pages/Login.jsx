import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Card, Container } from 'react-bootstrap';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [creds, setCreds] = useState({ email: '', password: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await login(creds.email, creds.password);
        
        if (result.success) {
            // Retrieve the user we just stored to check their role
            const storedUser = JSON.parse(localStorage.getItem('fitpro_user'));
            
            // 👇 UPDATED REDIRECT LOGIC 👇
            if (storedUser.role === 'ADMIN') {
                navigate('/admin');
            } else if (storedUser.role === 'TRAINER') {
                navigate('/trainer'); // Send Trainers to their specific page
            } else {
                navigate('/dashboard'); // Members go here
            }
        } else {
            alert(result.message);
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{minHeight: '70vh'}}>
            <Card className="p-4 w-100" style={{maxWidth: '400px'}}>
                <Card.Body>
                    <h2 className="text-center text-white fw-bold mb-2">Welcome Back</h2>
                    <p className="text-center text-secondary mb-4">Access your dashboard</p>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Control type="email" placeholder="Email" required 
                                onChange={e => setCreds({...creds, email: e.target.value})} />
                        </Form.Group>
                        <Form.Group className="mb-4">
                            <Form.Control type="password" placeholder="Password" required 
                                onChange={e => setCreds({...creds, password: e.target.value})} />
                        </Form.Group>
                        <Button variant="gold" type="submit" className="w-100 py-2">Login</Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Login;