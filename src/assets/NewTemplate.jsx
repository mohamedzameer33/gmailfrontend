import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NewTemplate = () => {
    const [temp, setTemp] = useState({ templateName: '', subject: '', body: '', file: null });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const save = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const data = new FormData();
        data.append('templateName', temp.templateName);
        data.append('subject', temp.subject);
        data.append('body', temp.body);
        if (temp.file) data.append('file', temp.file);

        try {
            const token = localStorage.getItem('auth_token');
            const response = await fetch('http://localhost:8080/api/mail/template', {
                method: 'POST',
                headers: { 'Authorization': `Basic ${token}` },
                body: data,
            });

            if (response.ok) {
                navigate('/'); 
            } else {
                alert("Vault Storage Error: Check Database Connection.");
            }
        } catch (err) {
            alert("Connection Lost: Spring Boot is Unreachable.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- INTERNAL STYLES ---
    const s = {
        container: {
            animation: 'fadeIn 0.5s ease-out',
            maxWidth: '900px',
            margin: '0 auto'
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            borderBottom: '2px solid #f1f5f9',
            paddingBottom: '20px',
            marginBottom: '30px'
        },
        label: {
            display: 'block',
            fontSize: '13px',
            fontWeight: '700',
            color: '#64748b',
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
        },
        input: {
            width: '100%',
            padding: '12px 16px',
            borderRadius: '10px',
            border: '1px solid #e2e8f0',
            fontSize: '15px',
            background: '#ffffff',
            boxSizing: 'border-box',
            outline: 'none',
            transition: 'all 0.2s'
        },
        textarea: {
            width: '100%',
            height: '300px',
            padding: '16px',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            fontSize: '15px',
            lineHeight: '1.6',
            resize: 'none',
            boxSizing: 'border-box',
            outline: 'none'
        },
        uploadZone: {
            padding: '25px',
            border: '2px dashed #cbd5e1',
            borderRadius: '16px',
            background: '#f8fafc',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '20px'
        },
        btnSecondary: {
            background: 'transparent',
            border: '1px solid #e2e8f0',
            color: '#64748b',
            padding: '10px 20px',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '14px'
        },
        btnPrimary: {
            background: '#6366f1',
            color: 'white',
            border: 'none',
            padding: '14px 40px',
            borderRadius: '10px',
            fontWeight: '700',
            fontSize: '15px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)',
            transition: '0.2s'
        }
    };

    return (
        <div style={s.container}>
            <style>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .input-focus:focus { border-color: #6366f1 !important; box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1); }
                .btn-hover:hover { filter: brightness(1.1); transform: translateY(-1px); }
            `}</style>

            <div style={s.header}>
                <div>
                    <h2 style={{fontSize: '24px', fontWeight: '800', color: '#1e293b', margin: 0}}>Template Architect</h2>
                    <p style={{color: '#94a3b8', fontSize: '14px', marginTop: '4px'}}>Configure master blueprints for rapid application dispatch.</p>
                </div>
                <button 
                    className="btn-hover" 
                    style={s.btnSecondary} 
                    onClick={() => navigate('/')}
                >
                    Back to Hub
                </button>
            </div>

            <form onSubmit={save}>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px'}}>
                    <div>
                        <label style={s.label}>Name</label>
                        <input 
                            className="input-focus"
                            style={s.input} 
                            placeholder="Template Name" 
                            value={temp.templateName}
                            onChange={e => setTemp({...temp, templateName: e.target.value})}
                            required 
                        />
                    </div>
                    <div>
                        <label style={s.label}>Subject Line</label>
                        <input 
                            className="input-focus"
                            style={s.input} 
                            placeholder="Application for [Role]" 
                            value={temp.subject}
                            onChange={e => setTemp({...temp, subject: e.target.value})}
                            required 
                        />
                    </div>
                </div>

                <div style={{marginBottom: '25px'}}>
                    <label style={s.label}>Master Body Content</label>
                    <textarea 
                        className="input-focus"
                        style={s.textarea} 
                        placeholder="Construct your professional narrative blueprint..."
                        value={temp.body}
                        onChange={e => setTemp({...temp, body: e.target.value})}
                        required 
                    ></textarea>
                </div>

                <div style={s.uploadZone}>
                    <div>
                        <div style={{fontWeight: '700', fontSize: '15px', color: '#1e293b'}}>Primary Document</div>
                        <div style={{fontSize: '13px', color: '#94a3b8', marginTop: '2px'}}>
                            {temp.file ? `✅ ${temp.file.name}` : "Attach Master Resume (PDF/DOCX)"}
                        </div>
                    </div>
                    <input 
                        type="file" 
                        id="template-file" 
                        hidden 
                        onChange={e => setTemp({...temp, file: e.target.files[0]})} 
                    />
                    <button 
                        type="button" 
                        className="btn-hover"
                        style={{...s.btnSecondary, background: '#ffffff'}} 
                        onClick={() => document.getElementById('template-file').click()}
                    >
                        {temp.file ? 'Replace File' : 'Browse Files'}
                    </button>
                </div>

                <div style={{marginTop: '40px', textAlign: 'right', borderTop: '2px solid #f1f5f9', paddingTop: '25px'}}>
                    <button 
                        type="submit" 
                        className="btn-hover"
                        style={{...s.btnPrimary, opacity: isSubmitting ? 0.7 : 1}} 
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Archiving to Vault...' : 'Secure & Save Template'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NewTemplate;