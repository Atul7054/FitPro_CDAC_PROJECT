import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token'); // Get token from URL
    const navigate = useNavigate();
    
    const [password, setPassword] = useState('');
    const [msg, setMsg] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/reset-password', { token, newPassword: password });
            setMsg({ type: 'success', text: 'Password Reset! Redirecting...' });
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setMsg({ type: 'danger', text: 'Invalid or Expired Token.' });
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{minHeight: '70vh'}}>
            <Card className="bg-dark text-white p-4" style={{maxWidth: '400px', width: '100%'}}>
                <h3 className="text-center mb-3">Set New Password</h3>
                {msg && <Alert variant={msg.type}>{msg.text}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>New Password</Form.Label>
                        <Form.Control 
                            type="password" 
                            required 
                            className="bg-secondary text-white border-0"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Form.Group>
                    <Button variant="success" type="submit" className="w-100">Update Password</Button>
                </Form>
            </Card>
        </Container>
    );
};
export default ResetPassword;