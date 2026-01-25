import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Row, Col, Card, Table, Badge, Button, Modal, Form } from 'react-bootstrap';
import { Calendar, CreditCard, User, Activity, AlertCircle } from 'lucide-react';

const MemberDashboard = () => {
    const { user } = useAuth();
    const [member, setMember] = useState(null);
    const [payments, setPayments] = useState([]);
    const [attendance, setAttendance] = useState([]);
    
    // Payment Modal State
    const [showPayModal, setShowPayModal] = useState(false);
    const [processing, setProcessing] = useState(false);

    const fetchData = () => {
        if (user?.id) {
            api.get(`/members/${user.id}`).then(res => setMember(res.data));
            api.get(`/payments/${user.id}`).then(res => setPayments(res.data));
            api.get(`/attendance/member/${user.id}`).then(res => setAttendance(res.data));
        }
    };

    useEffect(() => {
        fetchData();
    }, [user]);

    // Handle "Mock" Payment
    const handlePayment = async () => {
        setProcessing(true);
        
        // SIMULATE PAYMENT GATEWAY DELAY (2 Seconds)
        setTimeout(async () => {
            try {
                // Call Backend to record payment
                // We use the same endpoint the Admin uses, but mark method as 'Online'
                await api.post(`/payments?memberId=${member.id}&amount=${member.membershipPlan.price}&method=Online`);
                
                alert("Payment Successful! Your plan is now Active.");
                setShowPayModal(false);
                fetchData(); // Refresh data to show 'Active' immediately
            } catch (error) {
                alert("Payment Failed: " + error.message);
            } finally {
                setProcessing(false);
            }
        }, 2000);
    };

    if (!member) return <div className="text-white text-center mt-5">Loading Profile...</div>;

    // Check if Plan is Active
    const isActive = member.endDate && new Date(member.endDate) > new Date();

    return (
        <div className="fade-in">
            <Row className="g-4">
                {/* Left Column: Profile & Payment Action */}
                <Col lg={4}>
                    {/* PROFILE CARD */}
                    <Card className="text-center p-3 h-100 mb-4">
                        <Card.Body>
                            <div className="rounded-circle bg-secondary bg-opacity-25 d-flex align-items-center justify-content-center mx-auto mb-3" 
                                 style={{width: '100px', height: '100px'}}>
                                <User size={48} className="text-warning" />
                            </div>
                            <h3 className="text-white fw-bold">{member.name}</h3>
                            <p className="text-secondary">{member.user?.email}</p>
                            
                            <div className="d-flex justify-content-between border-bottom border-secondary border-opacity-25 py-2 mt-3">
                                <span className="text-secondary">Plan</span>
                                <span className="text-warning fw-bold">{member.membershipPlan?.planName}</span>
                            </div>
                            <div className="d-flex justify-content-between border-bottom border-secondary border-opacity-25 py-2">
                                <span className="text-secondary">Trainer</span>
                                <span className="text-white">{member.trainer ? member.trainer.trainerName : 'None'}</span>
                            </div>
                            <div className="d-flex justify-content-between py-2">
                                <span className="text-secondary">Status</span>
                                <Badge bg={isActive ? "success" : "danger"}>{isActive ? 'Active' : 'Expired'}</Badge>
                            </div>
                        </Card.Body>
                    </Card>

                    {/* PAY NOW CARD (Only shows if Expired) */}
                    {!isActive && (
                        <Card className="border-danger shadow-lg">
                            <Card.Body className="text-center">
                                <AlertCircle size={40} className="text-danger mb-2" />
                                <h4 className="text-white">Subscription Expired</h4>
                                <p className="text-secondary small">Renew your {member.membershipPlan?.planName} to continue access.</p>
                                <Button variant="danger" className="w-100 fw-bold py-2" onClick={() => setShowPayModal(true)}>
                                    PAY ₹{member.membershipPlan?.price} NOW
                                </Button>
                            </Card.Body>
                        </Card>
                    )}
                </Col>

                {/* Right Column: Stats & History */}
                <Col lg={8}>
                    <div className="d-flex flex-column gap-4">
                        {/* Validity Card */}
                        <Card>
                            <Card.Header className="bg-transparent border-0 text-white fw-bold d-flex align-items-center gap-2">
                                <Calendar className="text-warning" size={20} /> Subscription Validity
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col xs={6} className="text-center border-end border-secondary border-opacity-25">
                                        <small className="text-secondary text-uppercase">Start Date</small>
                                        <h5 className="text-white font-monospace mt-1">{member.startDate || 'N/A'}</h5>
                                    </Col>
                                    <Col xs={6} className="text-center">
                                        <small className="text-secondary text-uppercase">End Date</small>
                                        <h5 className="text-warning font-monospace mt-1">{member.endDate || 'N/A'}</h5>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>

                        {/* Payment History */}
                        <Card>
                            <Card.Header className="bg-transparent border-0 text-white fw-bold d-flex align-items-center gap-2">
                                <CreditCard className="text-warning" size={20} /> Payment History
                            </Card.Header>
                            <Card.Body className="p-0">
                                <Table hover responsive className="mb-0">
                                    <thead>
                                        <tr>
                                            <th className="bg-transparent text-secondary ps-4">Date</th>
                                            <th className="bg-transparent text-secondary">Amount</th>
                                            <th className="bg-transparent text-secondary">Method</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {payments.map(pay => (
                                            <tr key={pay.id}>
                                                <td className="ps-4 font-monospace">{pay.paymentDate}</td>
                                                <td className="text-success fw-bold">₹{pay.amount}</td>
                                                <td className="text-secondary">{pay.paymentMethod}</td>
                                            </tr>
                                        ))}
                                        {payments.length === 0 && (
                                            <tr>
                                                <td colSpan="3" className="text-center text-secondary py-3">No payments found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                        
                         {/* Attendance Log */}
                        <Card>
                            <Card.Header className="bg-transparent border-0 text-white fw-bold d-flex align-items-center gap-2">
                                <Activity className="text-warning" size={20} /> Attendance Log
                            </Card.Header>
                            <Card.Body>
                                <div className="d-flex flex-wrap gap-2">
                                    {attendance.map(record => (
                                        <Badge key={record.id} bg="success" className="bg-opacity-25 text-success border border-success px-3 py-2 font-monospace">
                                            {record.date}
                                        </Badge>
                                    ))}
                                    {attendance.length === 0 && <span className="text-secondary">No attendance recorded.</span>}
                                </div>
                            </Card.Body>
                        </Card>
                    </div>
                </Col>
            </Row>

            {/* MOCK PAYMENT MODAL */}
            <Modal show={showPayModal} onHide={() => setShowPayModal(false)} centered>
                <Modal.Header closeButton className="bg-dark border-secondary">
                    <Modal.Title className="text-white">Secure Payment</Modal.Title>
                </Modal.Header>
                <Modal.Body className="bg-dark text-white">
                    <div className="text-center mb-4">
                        <h2 className="text-success fw-bold">₹{member.membershipPlan?.price}</h2>
                        <p className="text-secondary">Upgrade to {member.membershipPlan?.planName}</p>
                    </div>
                    
                    <Form.Group className="mb-3">
                        <Form.Label>Card Number</Form.Label>
                        <Form.Control type="text" placeholder="4242 4242 4242 4242" className="bg-secondary bg-opacity-10 border-secondary text-white" />
                    </Form.Group>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label>Expiry</Form.Label>
                                <Form.Control type="text" placeholder="MM/YY" className="bg-secondary bg-opacity-10 border-secondary text-white" />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label>CVV</Form.Label>
                                <Form.Control type="text" placeholder="123" className="bg-secondary bg-opacity-10 border-secondary text-white" />
                            </Form.Group>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer className="bg-dark border-secondary">
                    <Button variant="secondary" onClick={() => setShowPayModal(false)}>Cancel</Button>
                    <Button variant="success" onClick={handlePayment} disabled={processing}>
                        {processing ? 'Processing...' : 'Pay Now'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default MemberDashboard;