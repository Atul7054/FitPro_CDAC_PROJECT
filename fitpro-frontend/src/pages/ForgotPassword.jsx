import { useState } from 'react';
import api from '../api/axios';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [msg, setMsg] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/forgot-password', { email });
            setMsg({ type: 'success', text: 'Reset link sent! (Check Backend Console)' });
        } catch (err) {
            setMsg({ type: 'danger', text: 'User not found or error occurred.' });
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{minHeight: '70vh'}}>
            <Card className="bg-dark text-white p-4" style={{maxWidth: '400px', width: '100%'}}>
                <h3 className="text-center mb-3">Forgot Password</h3>
                {msg && <Alert variant={msg.type}>{msg.text}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Enter your email</Form.Label>
                        <Form.Control 
                            type="email" 
                            required 
                            className="bg-secondary text-white border-0"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Form.Group>
                    <Button variant="warning" type="submit" className="w-100">Send Reset Link</Button>
                </Form>
            </Card>
        </Container>
    );
};
export default ForgotPassword;