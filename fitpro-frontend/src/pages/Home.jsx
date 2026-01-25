import { Link } from 'react-router-dom';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Dumbbell, Users, Clock, ChevronRight, Star } from 'lucide-react';

const Home = () => {
    return (
        <div className="fade-in">
            {/* 1. HERO SECTION */}
            <div className="text-center text-white d-flex align-items-center justify-content-center" 
                 style={{
                     minHeight: '80vh', 
                     background: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.8)), url("https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop")',
                     backgroundSize: 'cover',
                     backgroundPosition: 'center',
                     borderRadius: '0 0 2rem 2rem'
                 }}>
                <Container>
                    <h1 className="display-3 fw-bold text-uppercase mb-3">
                        <span className="text-warning">Unleash</span> Your Potential
                    </h1>
                    <p className="lead text-light opacity-75 mb-5 mx-auto" style={{maxWidth: '600px'}}>
                        Join the elite fitness community. Expert trainers, world-class equipment, 
                        and plans designed to transform your body and mind.
                    </p>
                    <div className="d-flex gap-3 justify-content-center">
                        <Link to="/register">
                            <Button variant="gold" size="lg" className="px-5 py-3 fw-bold rounded-pill">
                                Join Now <ChevronRight size={20} />
                            </Button>
                        </Link>
                        <Link to="/login">
                            <Button variant="outline-light" size="lg" className="px-5 py-3 fw-bold rounded-pill">
                                Member Login
                            </Button>
                        </Link>
                    </div>
                </Container>
            </div>

            {/* 2. FEATURES SECTION */}
            <Container className="py-5 mt-5">
                <div className="text-center mb-5">
                    <h2 className="fw-bold text-white">Why Choose <span className="text-warning">FitPro</span>?</h2>
                    <p className="text-secondary">Everything you need to crush your goals.</p>
                </div>
                
                <Row className="g-4">
                    {/* Feature 1 */}
                    <Col md={4}>
                        <Card className="h-100 bg-dark border-secondary text-white p-3 hover-scale">
                            <Card.Body className="text-center">
                                <div className="bg-warning bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                                    <Dumbbell size={40} className="text-warning" />
                                </div>
                                <h4 className="fw-bold">Premium Equipment</h4>
                                <p className="text-secondary">Train with state-of-the-art Hammer Strength machines and free weights.</p>
                            </Card.Body>
                        </Card>
                    </Col>
                    
                    {/* Feature 2 */}
                    <Col md={4}>
                        <Card className="h-100 bg-dark border-secondary text-white p-3 hover-scale">
                            <Card.Body className="text-center">
                                <div className="bg-success bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                                    <Users size={40} className="text-success" />
                                </div>
                                <h4 className="fw-bold">Expert Trainers</h4>
                                <p className="text-secondary">Certified professionals ready to guide your personal fitness journey.</p>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Feature 3 */}
                    <Col md={4}>
                        <Card className="h-100 bg-dark border-secondary text-white p-3 hover-scale">
                            <Card.Body className="text-center">
                                <div className="bg-primary bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                                    <Clock size={40} className="text-primary" />
                                </div>
                                <h4 className="fw-bold">Flexible Hours</h4>
                                <p className="text-secondary">Open early and late. We fit into your schedule, not the other way around.</p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            {/* 3. TESTIMONIAL / FOOTER PREVIEW */}
            <Container className="py-5 mb-5 border-top border-secondary border-opacity-25">
                <Row className="justify-content-center">
                    <Col md={8} className="text-center">
                        <div className="text-warning mb-3">
                            <Star fill="currentColor" /> <Star fill="currentColor" /> <Star fill="currentColor" /> <Star fill="currentColor" /> <Star fill="currentColor" />
                        </div>
                        <h3 className="text-white fst-italic mb-3">"FitPro changed my life. The trainers are incredible and the vibe is unmatched."</h3>
                        <p className="text-secondary">— Alex Johnson, Member since 2023</p>
                    </Col>
                </Row>
            </Container>
            
            {/* Simple CSS for hover effect */}
            <style>
                {`
                .hover-scale { transition: transform 0.3s; }
                .hover-scale:hover { transform: translateY(-10px); }
                `}
            </style>
        </div>
    );
};

export default Home;