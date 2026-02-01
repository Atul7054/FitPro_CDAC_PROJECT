import { useState } from 'react';
import { Card, Form, Button, Alert, ProgressBar } from 'react-bootstrap';
import { Activity, Calculator } from 'lucide-react';

const BmiCalculator = () => {
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [result, setResult] = useState(null);

    const calculateBMI = (e) => {
        e.preventDefault();
        if (!height || !weight) return;

        const h = parseFloat(height); // cm
        const w = parseFloat(weight); // kg
        
        // BMI Formula: kg / m^2
        const bmiValue = (w / Math.pow(h / 100, 2)).toFixed(1);
        let plan = '';
        let variant = '';
        let progress = 0;

        // Logic for Recommendations
        if (bmiValue < 18.5) {
            plan = "Muscle Gain / Bulking Plan";
            variant = "info"; // Blue
            progress = 25;
        } else if (bmiValue >= 18.5 && bmiValue <= 24.9) {
            plan = "Maintenance & Strength Plan";
            variant = "success"; // Green
            progress = 50;
        } else if (bmiValue >= 25 && bmiValue <= 29.9) {
            plan = "Cardio + Strength (Fat Loss)";
            variant = "warning"; // Yellow
            progress = 75;
        } else {
            plan = "High Intensity Cardio (Weight Loss)";
            variant = "danger"; // Red
            progress = 100;
        }

        setResult({ bmi: bmiValue, plan, variant, progress });
    };

    return (
        <Card className="bg-dark border-secondary text-white h-100">
            <Card.Header className="bg-transparent border-secondary fw-bold d-flex align-items-center gap-2">
                <Calculator size={20} className="text-warning"/> 
                Smart Plan Recommender
            </Card.Header>
            <Card.Body>
                <Form onSubmit={calculateBMI}>
                    <div className="d-flex gap-3 mb-3">
                        <Form.Group className="flex-grow-1">
                            <Form.Label className="small text-secondary">Height (cm)</Form.Label>
                            <Form.Control 
                                type="number" 
                                placeholder="175" 
                                className="bg-secondary text-white border-0"
                                value={height}
                                onChange={(e) => setHeight(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="flex-grow-1">
                            <Form.Label className="small text-secondary">Weight (kg)</Form.Label>
                            <Form.Control 
                                type="number" 
                                placeholder="70" 
                                className="bg-secondary text-white border-0"
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                            />
                        </Form.Group>
                    </div>
                    <Button variant="outline-warning" type="submit" className="w-100 mb-3">
                        Calculate & Recommend
                    </Button>
                </Form>

                {result && (
                    <div className="fade-in">
                        <hr className="border-secondary" />
                        <div className="d-flex justify-content-between align-items-end mb-2">
                            <h5 className="mb-0">BMI: <span className={`text-${result.variant}`}>{result.bmi}</span></h5>
                            <small className="text-secondary">Your Suggested Plan:</small>
                        </div>
                        
                        <Alert variant={result.variant} className="py-2 text-center fw-bold">
                            <Activity size={18} className="me-2" />
                            {result.plan}
                        </Alert>

                        <div className="mt-2">
                            <small className="text-secondary d-block mb-1">Health Scale</small>
                            <ProgressBar 
                                variant={result.variant} 
                                now={result.progress} 
                                style={{height: '6px'}} 
                            />
                        </div>
                    </div>
                )}
            </Card.Body>
        </Card>
    );
};

export default BmiCalculator;