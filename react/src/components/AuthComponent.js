import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AuthComponent() {
    const [isActive, setIsActive] = useState(false);
    const [username, setusername] = useState(''); 
    const [email, setEmail] = useState(''); 
    const [password, setPassword] = useState('');
    const [name, setName] = useState(''); 
    const [message, setMessage] = useState(''); 
    const [isSuccess, setIsSuccess] = useState(false); 
    const [rememberMe, setRememberMe] = useState(false); 
    const navigate = useNavigate();

    const handleRegisterClick = () => {
        setIsActive(true);
        setMessage('');
        setIsSuccess(false);
    };

    const handleLoginClick = () => {
        setIsActive(false);
        setMessage('');
        setIsSuccess(false);
    };

    const handleSignInSubmit = async(e) => {
        e.preventDefault();
        setMessage('Signing in...');
        setIsSuccess(false);

        try {
            const response = await fetch('http://localhost:8081/api/front-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
                credentials: 'include',
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Signed in successfully!');
                setIsSuccess(true);

          
                if (rememberMe) {
                    localStorage.setItem('user', JSON.stringify(data)); 
                } else {
                    sessionStorage.setItem('user', JSON.stringify(data)); 
                }

              
                navigate('/');

            } else {
                if (Array.isArray(data.errors)) {
                    const errorMessages = data.errors.map(error => `${error.field}: ${error.defaultMessage}`).join(', ');
                    setMessage(errorMessages);
                } else {
                    setMessage('Registration failed! Please check your Email and Password.');
                }
                setIsSuccess(false);
                console.error('Sign Up Error:', data.errors);
            }
        } catch (error) {
            setMessage('An unexpected error occurred. Please try again later.');
            setIsSuccess(false);
        }
    };

    const handleSignUpSubmit = async(e) => {
        e.preventDefault();
        setMessage('Registering...');
        setIsSuccess(false);

        try {
            const response = await fetch('http://localhost:8081/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Account created successfully!');
                setIsSuccess(true);

                // تخزين البيانات حسب خيار "تذكرني"
                if (rememberMe) {
                    localStorage.setItem('user', JSON.stringify(data));
                } else {
                    sessionStorage.setItem('user', JSON.stringify(data));
                }

               
                setIsActive(false);

            } else {
                if (data) {
                    setMessage(Object.entries(data)
                        .map(([key, value]) => `${key}: ${value}`)
                        .join(', '));
                    setIsSuccess(false);
                } else {
                    setMessage('Registration failed! Please check your details.');
                    setIsSuccess(false);
                }
            }
        } catch (error) {
            setIsSuccess(false);
            setMessage(`Network error during Sign Up:` + error);
        }
    };

    const styles = {
        authBody: {
            background: 'linear-gradient(to right, #66cef6, #f666b1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            height: '100vh',
            margin: 0,
            fontFamily: '"Montserrat", sans-serif'
        },
        authContainer: {
            backgroundColor: '#fff',
            borderRadius: '30px',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.35)',
            position: 'relative',
            overflow: 'hidden',
            width: '768px',
            maxWidth: '100%',
            minHeight: '480px',
            transition: 'all 0.6s ease-in-out'
        },
        formWrapper: {
            position: 'absolute',
            top: 0,
            height: '100%',
            transition: 'all 0.6s ease-in-out'
        },
        signInForm: {
            left: 0,
            width: '50%',
            zIndex: 2,
            transform: isActive ? 'translateX(100%)' : 'translateX(0)'
        },
        signUpForm: {
            left: 0,
            width: '50%',
            opacity: isActive ? 1 : 0,
            zIndex: isActive ? 5 : 1,
            transform: isActive ? 'translateX(100%)' : 'translateX(0)'
        },
        authForm: {
            backgroundColor: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            padding: '0 40px',
            height: '100%'
        },
        formTitle: {
            fontSize: '24px',
            fontWeight: 'bold',
            marginBottom: '20px',
            color: '#333'
        },
        socialIconsWrapper: {
            margin: '20px 0',
            display: 'flex',
            gap: '12px'
        },
        socialIcon: {
            border: '1px solid #ccc',
            borderRadius: '20%',
            display: 'inline-flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '40px',
            height: '40px',
            textDecoration: 'none',
            color: '#333',
            transition: 'all 0.3s ease'
        },
        authPrompt: {
            fontSize: '12px',
            color: '#666',
            marginBottom: '15px'
        },
        authInput: {
            backgroundColor: '#eee',
            border: 'none',
            margin: '8px 0',
            padding: '10px 15px',
            fontSize: '13px',
            borderRadius: '8px',
            width: '100%',
            outline: 'none',
            boxSizing: 'border-box'
        },
        forgotPasswordLink: {
            color: '#333',
            fontSize: '13px',
            textDecoration: 'none',
            margin: '15px 0 10px',
            cursor: 'pointer'
        },
        authButton: {
            background: 'linear-gradient(to right, #66cef6, #f666b1)',
            color: '#fff',
            fontSize: '12px',
            padding: '10px 45px',
            border: '1px solid #fff',
            borderRadius: '8px',
            fontWeight: '600',
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            marginTop: '10px',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
        },
        togglePanelContainer: {
            position: 'absolute',
            top: 0,
            left: '50%',
            width: '50%',
            height: '100%',
            overflow: 'hidden',
            transition: 'all 0.6s ease-in-out',
            borderRadius: isActive ? '0 150px 100px 0' : '150px 0 0 100px',
            zIndex: 100,
            transform: isActive ? 'translateX(-100%)' : 'translateX(0)'
        },
        togglePanelMain: {
            background: 'linear-gradient(to right, #66cef6, #f666b1)',
            height: '100%',
            color: '#fff',
            position: 'relative',
            left: '-100%',
            width: '200%',
            transform: isActive ? 'translateX(50%)' : 'translateX(0)',
            transition: 'all 0.6s ease-in-out'
        },
        togglePanel: {
            position: 'absolute',
            width: '50%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            padding: '0 30px',
            textAlign: 'center',
            top: 0,
            transition: 'all 0.6s ease-in-out'
        },
        togglePanelLeft: {
            transform: isActive ? 'translateX(0)' : 'translateX(-200%)'
        },
        togglePanelRight: {
            right: 0,
            transform: isActive ? 'translateX(200%)' : 'translateX(0)'
        },
        togglePanelTitle: {
            fontSize: '24px',
            fontWeight: 'bold',
            marginBottom: '15px'
        },
        togglePanelDescription: {
            fontSize: '14px',
            lineHeight: '20px',
            letterSpacing: '0.3px',
            margin: '20px 0',
            opacity: 0.9
        },
        hiddenButton: {
            backgroundColor: 'transparent',
            border: '2px solid #fff',
            color: '#fff',
            fontSize: '12px',
            padding: '10px 45px',
            borderRadius: '8px',
            fontWeight: '600',
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
        },
        rememberMeCheckbox: {
            display: 'flex',
            alignItems: 'center',
            margin: '10px 0',
            cursor: 'pointer'
        },
        rememberMeLabel: {
            fontSize: '13px',
            color: '#666',
            marginLeft: '8px',
            cursor: 'pointer'
        },
        messageStyle: {
            marginTop: '2px',
            color: isSuccess ? '#28a745' : '#dc3545',
            fontWeight: 'bold'
        }
    };

    return (
        <div style={styles.authBody}>
            <div style={styles.authContainer}>
                
                <div style={{...styles.formWrapper, ...styles.signInForm}}>
                    <form style={styles.authForm} onSubmit={handleSignInSubmit}>
                        <h1 style={styles.formTitle}>Sign In</h1>

                        <div style={styles.socialIconsWrapper}>
                            <a href="#" style={styles.socialIcon}>
                                <i className="fab fa-google-plus-g"></i>
                            </a>
                            <a href="#" style={styles.socialIcon}>
                                <i className="fab fa-facebook-f"></i>
                            </a>
                            <a href="#" style={styles.socialIcon}>
                                <i className="fab fa-github"></i>
                            </a>
                            <a href="#" style={styles.socialIcon}>
                                <i className="fab fa-linkedin-in"></i>
                            </a>
                        </div>

                        <span style={styles.authPrompt}>or use your email password</span>

                        <input 
                            type="text" 
                            placeholder="Username" 
                            style={styles.authInput}
                            value={username}
                            onChange={(e) => setusername(e.target.value)}
                            required
                        />
                        <input 
                            type="password" 
                            placeholder="Password" 
                            style={styles.authInput}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        
                        <div style={styles.rememberMeCheckbox}>
                            <input 
                                type="checkbox" 
                                id="rememberMe"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            <label htmlFor="rememberMe" style={styles.rememberMeLabel}>
                                Remember me
                            </label>
                        </div>

                        <a href="#" style={styles.forgotPasswordLink}>
                            Forget Your Password?
                        </a>

                        <button style={styles.authButton} type="submit">
                            Sign In
                        </button>

                        {message && !isActive && <p style={styles.messageStyle}>{message}</p>}
                    </form>
                </div>

                
                <div style={{...styles.formWrapper, ...styles.signUpForm}}>
                    <form style={styles.authForm} onSubmit={handleSignUpSubmit}>
                        <h1 style={styles.formTitle}>Create Account</h1>

                        <div style={styles.socialIconsWrapper}>
                            <a href="#" style={styles.socialIcon}>
                                <i className="fab fa-google-plus-g"></i>
                            </a>
                            <a href="#" style={styles.socialIcon}>
                                <i className="fab fa-facebook-f"></i>
                            </a>
                            <a href="#" style={styles.socialIcon}>
                                <i className="fab fa-github"></i>
                            </a>
                            <a href="#" style={styles.socialIcon}>
                                <i className="fab fa-linkedin-in"></i>
                            </a>
                        </div>

                        <span style={styles.authPrompt}>or use your email for registration</span>

                        <input
                            type="text"
                            placeholder="Name"
                            style={styles.authInput}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            style={styles.authInput}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            style={styles.authInput}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                     
                        <div style={styles.rememberMeCheckbox}>
                            <input 
                                type="checkbox" 
                                id="rememberMeSignup"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            <label htmlFor="rememberMeSignup" style={styles.rememberMeLabel}>
                                Remember me
                            </label>
                        </div>

                        <button style={styles.authButton} type="submit">
                            Sign Up
                        </button>

                        {message && isActive && <p style={styles.messageStyle}>{message}</p>}
                    </form>
                </div>

             
                <div style={styles.togglePanelContainer}>
                    <div style={styles.togglePanelMain}>
                      
                        <div style={{...styles.togglePanel, ...styles.togglePanelLeft}}>
                            <h1 style={styles.togglePanelTitle}>Welcome Back!</h1>
                            <p style={styles.togglePanelDescription}>
                                Enter your personal details to use all of site features
                            </p>
                            <button
                                onClick={handleLoginClick}
                                style={styles.hiddenButton}
                            >
                                Sign In
                            </button>
                        </div>

                        
                        <div style={{...styles.togglePanel, ...styles.togglePanelRight}}>
                            <h1 style={styles.togglePanelTitle}>Hello, Friend!</h1>
                            <p style={styles.togglePanelDescription}>
                                Register with your personal details to use all of site features
                            </p>
                            <button
                                onClick={handleRegisterClick}
                                style={styles.hiddenButton}
                            >
                                Sign Up
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}