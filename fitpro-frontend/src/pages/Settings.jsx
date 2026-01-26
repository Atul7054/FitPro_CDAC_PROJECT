import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Container, Card, Form, Button, Alert, Row, Col, Spinner } from 'react-bootstrap';
import { User, Save, Phone, MapPin, Mail } from 'lucide-react';

const Settings = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    
    // 👇 STATE: Added name and email
    const [formData, setFormData] = useState({ 
        name: '', 
        email: '', 
        phone: '', 
        address: '' 
    });
    
    const [msg, setMsg] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) fetchProfile();
    }, [user]);

    const fetchProfile = async () => {
        try {
            let foundProfile = null;
            if (user.role === 'MEMBER') {
                const res = await api.get('/members');
                foundProfile = res.data.find(m => (m.user && m.user.id == user.id) || (m.user && m.user.email === user.email));
            } else if (user.role === 'TRAINER') {
                const res = await api.get('/trainers');
                foundProfile = res.data.find(t => (t.user && t.user.id == user.id) || (t.user && t.user.email === user.email) || t.email === user.email);
            }

            if (foundProfile) {
                setProfile(foundProfile);
                // 👇 PRE-FILL ALL FIELDS
                setFormData({ 
                    name: user.role === 'TRAINER' ? foundProfile.trainerName : foundProfile.name,
                    email: foundProfile.user?.email || user.email,
                    phone: foundProfile.phone || '', 
                    address: foundProfile.address || '' 
                });
            } else {
                setError("Could not find your profile data.");
            }
        } catch (err) {
            setError("Failed to load profile.");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setMsg(''); setError('');
        
        try {
            if (user.role === 'MEMBER') {
                await api.patch(`/members/${profile.id}`, {
                    name: formData.name, // Send Name
                    email: formData.email, // Send Email
                    phone: formData.phone,
                    address: formData.address
                });
            } else if (user.role === 'TRAINER') {
                await api.patch(`/trainers/${profile.id}`, {
                    trainerName: formData.name, // Send Name (Key is 'trainerName')
                    email: formData.email, // Send Email
                    phone: formData.phone
                });
            }
            setMsg('Profile Updated Successfully! ✅');
        } catch (err) {
            setError('Update Failed. Email might be taken or server error.');
        }
    };

    if (loading) return <div className="text-center mt-5 text-white"><Spinner animation="border" variant="warning"/></div>;
    if (!profile) return null;

    return (
        <div className="fade-in">
            <Container className="py-5">
                <Row className="justify-content-center">
                    <Col md={8} lg={6}>
                        <Card className="bg-dark border-secondary text-white shadow-lg">
                            <Card.Header className="bg-transparent border-secondary py-3">
                                <h4 className="m-0 d-flex align-items-center gap-2 text-warning fw-bold">
                                    <User size={24} /> Edit Profile
                                </h4>
                            </Card.Header>
                            <Card.Body>
                                {msg && <Alert variant="success">{msg}</Alert>}
                                {error && <Alert variant="danger">{error}</Alert>}

                                <Form onSubmit={handleUpdate}>
                                    
                                    {/* 👇 EDITABLE: Name */}
                                    <Form.Group className="mb-3">
                                        <Form.Label className="text-secondary small text-uppercase fw-bold">Full Name</Form.Label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-dark border-secondary text-secondary"><User size={18}/></span>
                                            <Form.Control 
                                                value={formData.name} 
                                                onChange={e => setFormData({...formData, name: e.target.value})}
                                                className="bg-dark border-secondary text-white shadow-none"
                                            />
                                        </div>
                                    </Form.Group>

                                    {/* 👇 EDITABLE: Email */}
                                    <Form.Group className="mb-3">
                                        <Form.Label className="text-secondary small text-uppercase fw-bold">Email</Form.Label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-dark border-secondary text-secondary"><Mail size={18}/></span>
                                            <Form.Control 
                                                type="email"
                                                value={formData.email} 
                                                onChange={e => setFormData({...formData, email: e.target.value})}
                                                className="bg-dark border-secondary text-white shadow-none"
                                            />
                                        </div>
                                    </Form.Group>

                                    <hr className="border-secondary my-4 opacity-50"/>

                                    <Form.Group className="mb-3">
                                        <Form.Label className="text-warning small text-uppercase fw-bold">Phone Number</Form.Label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-dark border-secondary text-secondary"><Phone size={18}/></span>
                                            <Form.Control 
                                                value={formData.phone} 
                                                onChange={e => setFormData({...formData, phone: e.target.value})}
                                                className="bg-dark border-secondary text-white shadow-none"
                                            />
                                        </div>
                                    </Form.Group>

                                    {user.role === 'MEMBER' && (
                                        <Form.Group className="mb-4">
                                            <Form.Label className="text-warning small text-uppercase fw-bold">Address</Form.Label>
                                            <div className="input-group">
                                                <span className="input-group-text bg-dark border-secondary text-secondary"><MapPin size={18}/></span>
                                                <Form.Control 
                                                    value={formData.address} 
                                                    onChange={e => setFormData({...formData, address: e.target.value})}
                                                    className="bg-dark border-secondary text-white shadow-none"
                                                />
                                            </div>
                                        </Form.Group>
                                    )}

                                    <Button variant="gold" type="submit" className="w-100 fw-bold py-2 mt-2">
                                        <Save size={18} className="me-2" /> Save Changes
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Settings;