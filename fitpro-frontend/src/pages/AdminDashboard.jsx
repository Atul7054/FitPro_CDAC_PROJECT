import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Row, Col, Card, Table, Button, Badge, Modal, Form } from 'react-bootstrap';
import { Trash2, DollarSign, CheckSquare, Plus, Users, UserCheck, TrendingUp, Edit, Save } from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState({});
    const [members, setMembers] = useState([]);
    const [trainers, setTrainers] = useState([]);
    
    // Add Modal State
    const [showTrainerModal, setShowTrainerModal] = useState(false);
    const [showEditTrainerModal, setShowEditTrainerModal] = useState(false);
    const [showEditMemberModal, setShowEditMemberModal] = useState(false);

    // Data State
    const [newTrainer, setNewTrainer] = useState({ 
        trainerName: '', email: '', password: '', phone: '', specialization: '' 
    });
    
    const [editingTrainer, setEditingTrainer] = useState(null);
    const [editingMember, setEditingMember] = useState(null);

    const fetchAll = () => {
        api.get('/admin/stats').then(res => setStats(res.data)).catch(err => console.error(err));
        api.get('/admin/members').then(res => setMembers(res.data)).catch(err => console.error(err));
        api.get('/admin/trainers').then(res => setTrainers(res.data)).catch(err => console.error(err));
    };

    useEffect(() => { fetchAll(); }, []);

    // --- ACTIONS ---

    const handlePayment = async (memberId, amount) => {
        if(confirm(`Confirm CASH payment of ₹${amount}?`)) {
            try {
                await api.post(`/payments?memberId=${memberId}&amount=${amount}&method=Cash`);
                alert("Payment Recorded");
                fetchAll();
            } catch (e) { alert("Failed: " + e.message); }
        }
    };

    const handleCheckIn = async (memberId) => {
        try {
            await api.post(`/attendance?memberId=${memberId}&status=Present`);
            alert("Member Checked In ✅");
        } catch (e) { alert("Error checking in"); }
    };

    const handleDeleteMember = async (id) => {
        if(confirm("Delete this member?")) {
            try {
                await api.delete(`/admin/members/${id}`);
                alert("Member Deleted");
                fetchAll();
            } catch (e) { alert("Delete failed"); }
        }
    };

    const handleDeleteTrainer = async (id) => {
        if(confirm("Are you sure you want to fire this trainer?")) {
            try {
                await api.delete(`/admin/trainers/${id}`);
                alert("Trainer Deleted");
                fetchAll();
            } catch (e) { alert("Delete failed"); }
        }
    };

    const handleAddTrainer = async () => {
        try {
            await api.post('/trainers', newTrainer);
            alert("Trainer Added Successfully!");
            setShowTrainerModal(false);
            setNewTrainer({ trainerName: '', email: '', password: '', phone: '', specialization: '' });
            fetchAll();
        } catch (e) { 
            alert("Error adding trainer: " + (e.response?.status === 403 ? "Access Denied" : e.message)); 
        }
    };

    // --- EDIT LOGIC ---

    const openEditTrainer = (trainer) => {
        setEditingTrainer({
            id: trainer.id,
            trainerName: trainer.trainerName,
            phone: trainer.phone,
            specialization: trainer.specialization,
            email: trainer.user?.email || ''
        });
        setShowEditTrainerModal(true);
    };

    const handleUpdateTrainer = async () => {
        try {
            // Nest email inside 'user' object for the backend
            const payload = {
                trainerName: editingTrainer.trainerName,
                phone: editingTrainer.phone,
                specialization: editingTrainer.specialization,
                user: { email: editingTrainer.email }
            };
            await api.put(`/admin/trainers/${editingTrainer.id}`, payload);
            alert("Trainer Updated!");
            setShowEditTrainerModal(false);
            fetchAll();
        } catch (e) { alert("Update failed"); }
    };

    const openEditMember = (member) => {
        setEditingMember({
            id: member.id,
            name: member.name,
            phone: member.phone,
            address: member.address,
            email: member.user?.email || ''
        });
        setShowEditMemberModal(true);
    };

    const handleUpdateMember = async () => {
        try {
            const payload = {
                name: editingMember.name,
                phone: editingMember.phone,
                address: editingMember.address,
                user: { email: editingMember.email }
            };
            await api.put(`/admin/members/${editingMember.id}`, payload);
            alert("Member Updated!");
            setShowEditMemberModal(false);
            fetchAll();
        } catch (e) { alert("Update failed"); }
    };

    return (
        <div className="fade-in">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="text-warning fw-bold">Admin Dashboard</h1>
                <Button variant="gold" onClick={() => setShowTrainerModal(true)}>
                    <Plus size={20} className="me-2" /> Add Trainer
                </Button>
            </div>

            {/* Stats Section */}
            <Row className="g-4 mb-5">
                <Col md={4}>
                    <Card className="p-3 border-primary h-100">
                        <Card.Body className="d-flex align-items-center gap-3">
                            <div className="bg-primary bg-opacity-25 p-3 rounded-circle text-primary"><Users size={32} /></div>
                            <div><p className="text-secondary mb-0">Total Members</p><h3 className="text-white fw-bold m-0">{members.length}</h3></div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="p-3 border-warning h-100">
                        <Card.Body className="d-flex align-items-center gap-3">
                            <div className="bg-warning bg-opacity-25 p-3 rounded-circle text-warning"><UserCheck size={32} /></div>
                            <div><p className="text-secondary mb-0">Active Trainers</p><h3 className="text-white fw-bold m-0">{trainers.length}</h3></div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="p-3 border-success h-100">
                        <Card.Body className="d-flex align-items-center gap-3">
                            <div className="bg-success bg-opacity-25 p-3 rounded-circle text-success"><TrendingUp size={32} /></div>
                            <div><p className="text-secondary mb-0">Total Revenue</p><h3 className="text-success fw-bold m-0">₹{stats.totalRevenue || 0}</h3></div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Member Table */}
            <Card className="mb-5">
                <Card.Header className="bg-transparent text-white fw-bold py-3 border-secondary">Member Management</Card.Header>
                <Table hover responsive className="mb-0 align-middle">
                    <thead>
                        <tr>
                            <th className="bg-transparent text-warning ps-4">Name</th>
                            <th className="bg-transparent text-warning">Plan</th>
                            <th className="bg-transparent text-warning">Status</th>
                            <th className="bg-transparent text-warning">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {members.map(m => (
                            <tr key={m.id}>
                                <td className="ps-4">
                                    <div className="fw-bold">{m.name}</div>
                                    <small className="text-secondary">{m.user?.email}</small>
                                </td>
                                <td>{m.membershipPlan?.planName}</td>
                                <td><Badge bg={m.endDate ? "success" : "danger"} className="bg-opacity-25 text-white">{m.endDate ? 'Active' : 'Pending'}</Badge></td>
                                <td>
                                    <div className="d-flex gap-2">
                                        <Button size="sm" variant="outline-info" onClick={() => openEditMember(m)}><Edit size={16} /></Button>
                                        <Button size="sm" variant="outline-success" onClick={() => handlePayment(m.id, m.membershipPlan?.price)}><DollarSign size={16} /></Button>
                                        <Button size="sm" variant="outline-primary" onClick={() => handleCheckIn(m.id)}><CheckSquare size={16} /></Button>
                                        <Button size="sm" variant="outline-danger" onClick={() => handleDeleteMember(m.id)}><Trash2 size={16} /></Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Card>

            {/* Trainer Table */}
            <Card>
                <Card.Header className="bg-transparent text-white fw-bold py-3 border-secondary">Trainer Staff</Card.Header>
                <Table hover responsive className="mb-0 align-middle">
                    <thead>
                        <tr>
                            <th className="bg-transparent text-warning ps-4">Trainer Name</th>
                            <th className="bg-transparent text-warning">Specialization</th>
                            <th className="bg-transparent text-warning">Phone</th>
                            <th className="bg-transparent text-warning text-end pe-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {trainers.map(t => (
                            <tr key={t.id}>
                                <td className="ps-4 fw-bold">{t.trainerName}</td>
                                <td><Badge bg="info" className="bg-opacity-25 text-info">{t.specialization}</Badge></td>
                                <td className="text-secondary">{t.phone}</td>
                                <td className="text-end pe-4">
                                    <div className="d-flex justify-content-end gap-2">
                                        <Button size="sm" variant="outline-info" onClick={() => openEditTrainer(t)}><Edit size={16} /></Button>
                                        <Button size="sm" variant="outline-danger" onClick={() => handleDeleteTrainer(t.id)}><Trash2 size={16} /></Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Card>

            {/* MODAL 1: Add Trainer */}
            <Modal show={showTrainerModal} onHide={() => setShowTrainerModal(false)} centered>
                <Modal.Header closeButton className="bg-dark border-secondary">
                    <Modal.Title className="text-white">Add New Trainer</Modal.Title>
                </Modal.Header>
                <Modal.Body className="bg-dark text-white">
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control className="bg-secondary bg-opacity-10 border-secondary text-white"
                                value={newTrainer.trainerName} onChange={e => setNewTrainer({...newTrainer, trainerName: e.target.value})} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control className="bg-secondary bg-opacity-10 border-secondary text-white"
                                value={newTrainer.email} onChange={e => setNewTrainer({...newTrainer, email: e.target.value})} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" className="bg-secondary bg-opacity-10 border-secondary text-white"
                                value={newTrainer.password} onChange={e => setNewTrainer({...newTrainer, password: e.target.value})} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Phone</Form.Label>
                            <Form.Control className="bg-secondary bg-opacity-10 border-secondary text-white"
                                value={newTrainer.phone} onChange={e => setNewTrainer({...newTrainer, phone: e.target.value})} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Specialization</Form.Label>
                            <Form.Control className="bg-secondary bg-opacity-10 border-secondary text-white"
                                value={newTrainer.specialization} onChange={e => setNewTrainer({...newTrainer, specialization: e.target.value})} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="bg-dark border-secondary">
                    <Button variant="secondary" onClick={() => setShowTrainerModal(false)}>Cancel</Button>
                    <Button variant="gold" onClick={handleAddTrainer}>Save Trainer</Button>
                </Modal.Footer>
            </Modal>

            {/* MODAL 2: Edit Trainer */}
            <Modal show={showEditTrainerModal} onHide={() => setShowEditTrainerModal(false)} centered>
                <Modal.Header closeButton className="bg-dark border-secondary">
                    <Modal.Title className="text-white">Edit Trainer</Modal.Title>
                </Modal.Header>
                <Modal.Body className="bg-dark text-white">
                    {editingTrainer && (
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Name</Form.Label>
                                <Form.Control className="bg-secondary bg-opacity-10 border-secondary text-white"
                                    value={editingTrainer.trainerName} onChange={e => setEditingTrainer({...editingTrainer, trainerName: e.target.value})} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control className="bg-secondary bg-opacity-10 border-secondary text-white"
                                    value={editingTrainer.email} onChange={e => setEditingTrainer({...editingTrainer, email: e.target.value})} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Phone</Form.Label>
                                <Form.Control className="bg-secondary bg-opacity-10 border-secondary text-white"
                                    value={editingTrainer.phone} onChange={e => setEditingTrainer({...editingTrainer, phone: e.target.value})} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Specialization</Form.Label>
                                <Form.Control className="bg-secondary bg-opacity-10 border-secondary text-white"
                                    value={editingTrainer.specialization} onChange={e => setEditingTrainer({...editingTrainer, specialization: e.target.value})} />
                            </Form.Group>
                        </Form>
                    )}
                </Modal.Body>
                <Modal.Footer className="bg-dark border-secondary">
                    <Button variant="secondary" onClick={() => setShowEditTrainerModal(false)}>Cancel</Button>
                    <Button variant="gold" onClick={handleUpdateTrainer}><Save size={18} className="me-2"/> Update</Button>
                </Modal.Footer>
            </Modal>

            {/* MODAL 3: Edit Member */}
            <Modal show={showEditMemberModal} onHide={() => setShowEditMemberModal(false)} centered>
                <Modal.Header closeButton className="bg-dark border-secondary">
                    <Modal.Title className="text-white">Edit Member</Modal.Title>
                </Modal.Header>
                <Modal.Body className="bg-dark text-white">
                    {editingMember && (
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Name</Form.Label>
                                <Form.Control className="bg-secondary bg-opacity-10 border-secondary text-white"
                                    value={editingMember.name} onChange={e => setEditingMember({...editingMember, name: e.target.value})} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control className="bg-secondary bg-opacity-10 border-secondary text-white"
                                    value={editingMember.email} onChange={e => setEditingMember({...editingMember, email: e.target.value})} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Phone</Form.Label>
                                <Form.Control className="bg-secondary bg-opacity-10 border-secondary text-white"
                                    value={editingMember.phone} onChange={e => setEditingMember({...editingMember, phone: e.target.value})} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Address</Form.Label>
                                <Form.Control className="bg-secondary bg-opacity-10 border-secondary text-white"
                                    value={editingMember.address} onChange={e => setEditingMember({...editingMember, address: e.target.value})} />
                            </Form.Group>
                        </Form>
                    )}
                </Modal.Body>
                <Modal.Footer className="bg-dark border-secondary">
                    <Button variant="secondary" onClick={() => setShowEditMemberModal(false)}>Cancel</Button>
                    <Button variant="gold" onClick={handleUpdateMember}><Save size={18} className="me-2"/> Update</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default AdminDashboard;