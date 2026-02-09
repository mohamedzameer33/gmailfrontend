import React, { useState, useEffect } from 'react';

const EmailHome = () => {
  const [templates, setTemplates] = useState([]);
  const [formData, setFormData] = useState({ to: '', subject: '', body: '', file: null, templateId: null });
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => { fetchTemplates(); }, []);

  const fetchTemplates = async () => {
    const token = localStorage.getItem('auth_token');
    try {
      const res = await fetch('http://localhost:8080/api/mail/templates', {
        headers: { 'Authorization': `Basic ${token}` }
      });
      if (res.ok) setTemplates(await res.json());
    } catch (err) { console.error("Vault connection failed"); }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation(); // Prevents the row-click from loading the template
    if (!window.confirm("CRITICAL: Permanent deletion of this blueprint. Proceed?")) return;
    
    const token = localStorage.getItem('auth_token');
    try {
      const res = await fetch(`http://localhost:8080/api/mail/template/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Basic ${token}` }
      });
      if (res.ok) {
        setStatus({ type: 'success', msg: 'Blueprint Terminated' });
        fetchTemplates(); // Refresh list
      } else {
        setStatus({ type: 'error', msg: 'Deletion Failed' });
      }
    } catch {
      setStatus({ type: 'error', msg: 'Server Connection Error' });
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if(formData[key]) data.append(key, formData[key]);
    });

    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch('http://localhost:8080/api/mail/send', {
        method: 'POST',
        headers: { 'Authorization': `Basic ${token}` },
        body: data
      });
      if (res.ok) {
        setStatus({ type: 'success', msg: 'Transmission Successful' });
        setFormData({ ...formData, to: '', file: null });
      } else setStatus({ type: 'error', msg: 'Gateway Rejected Request' });
    } catch { setStatus({ type: 'error', msg: 'Server Protocol Error' }); }
    finally { setLoading(false); setTimeout(() => setStatus({type:'', msg:''}), 4000); }
  };

  const filteredTemplates = templates.filter(t => 
    t.templateName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="enterprise-wrapper">
      <style>{`
        :root { --p-color: #6366f1; --danger: #ef4444; --s-color: #f8fafc; --t-color: #1e293b; }
        .enterprise-wrapper { animation: fadeIn 0.4s ease; font-family: 'Inter', sans-serif; color: var(--t-color); }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }

        .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .metric-card { background: white; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; display: flex; align-items: center; gap: 15px; }
        .icon-circle { width: 45px; height: 45px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; }

        .main-grid { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 25px; }
        @media (max-width: 1100px) { .main-grid { grid-template-columns: 1fr; } }

        .glass-panel { background: white; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
        .panel-head { padding: 20px; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; background: #fff; }
        .panel-body { padding: 25px; }

        .data-table { width: 100%; border-collapse: collapse; font-size: 14px; }
        .data-table th { text-align: left; padding: 12px; color: #64748b; font-weight: 600; background: #f8fafc; }
        .data-table td { padding: 12px; border-bottom: 1px solid #f1f5f9; }
        .tr-row:hover { background: #fdfdff; }
        
        .badge { padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
        .badge-blue { background: #e0e7ff; color: #4338ca; }

        .e-input { width: 100%; padding: 12px; border-radius: 8px; border: 1px solid #cbd5e1; margin-bottom: 15px; font-size: 14px; transition: 0.2s; outline: none; box-sizing: border-box; }
        .e-input:focus { border-color: var(--p-color); box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1); }
        .e-label { font-size: 11px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; display: block; }

        .btn-dispatch { background: var(--p-color); color: white; border: none; padding: 14px; border-radius: 8px; font-weight: 700; cursor: pointer; width: 100%; transition: 0.3s; box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.3); }
        .btn-dispatch:hover { transform: translateY(-2px); filter: brightness(1.1); }
        
        .btn-action-del { background: #fff1f2; color: var(--danger); border: 1px solid #fecdd3; padding: 6px 10px; border-radius: 6px; font-size: 10px; font-weight: 800; cursor: pointer; transition: 0.2s; }
        .btn-action-del:hover { background: var(--danger); color: white; border-color: var(--danger); }
      `}</style>

      {/* TOP METRICS */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="icon-circle" style={{background: '#e0e7ff', color: '#4338ca'}}>📁</div>
          <div><div style={{fontSize: '20px', fontWeight: '800'}}>{templates.length}</div><div style={{fontSize: '12px', color: '#94a3b8'}}>Active Templates</div></div>
        </div>
        <div className="metric-card">
          <div className="icon-circle" style={{background: '#dcfce7', color: '#15803d'}}>⚡</div>
          <div><div style={{fontSize: '20px', fontWeight: '800'}}>STABLE</div><div style={{fontSize: '12px', color: '#94a3b8'}}>Gateway Status</div></div>
        </div>
        <div className="metric-card">
          <div className="icon-circle" style={{background: '#fef3c7', color: '#b45309'}}>🛰️</div>
          <div><div style={{fontSize: '20px', fontWeight: '800'}}>v2.4.0</div><div style={{fontSize: '12px', color: '#94a3b8'}}>System Version</div></div>
        </div>
      </div>

      <div className="main-grid">
        {/* ADVANCED COMPOSER */}
        <div className="glass-panel">
          <div className="panel-head">
            <h3 style={{margin:0}}>System Dispatcher</h3>
            <span style={{fontSize: '11px', fontWeight: 'bold', color: '#10b981'}}>● ENCRYPTION ACTIVE</span>
          </div>
          <div className="panel-body">
            <form onSubmit={handleSend}>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
                <div>
                  <span className="e-label">Select Template</span>
                  <select className="e-input" value={formData.templateId || ''} onChange={(e) => {
                    const t = templates.find(x => x.id === parseInt(e.target.value));
                    if(t) setFormData({...formData, subject: t.subject, body: t.body, templateId: t.id});
                    else setFormData({...formData, subject: '', body: '', templateId: null});
                  }}>
                    <option value="">Manual Entry</option>
                    {templates.map(t => <option key={t.id} value={t.id}>{t.templateName}</option>)}
                  </select>
                </div>
                <div>
                  <span className="e-label">Destination Address</span>
                  <input className="e-input" placeholder="recruiter@enterprise.com" value={formData.to} onChange={e => setFormData({...formData, to: e.target.value})} required />
                </div>
              </div>

              <span className="e-label">Subject Protocol</span>
              <input className="e-input" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} required />

              <span className="e-label">Secure Message Body</span>
              <textarea className="e-input" style={{height: '220px', resize: 'none'}} value={formData.body} onChange={e => setFormData({...formData, body: e.target.value})} required />

              <div style={{display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '20px'}}>
                <div style={{flex: 1}}>
                  <span className="e-label">Attachment Override</span>
                  <input type="file" style={{fontSize: '12px'}} onChange={e => setFormData({...formData, file: e.target.files[0]})} />
                </div>
                <button className="btn-dispatch" style={{width: '200px'}} disabled={loading}>
                  {loading ? 'EXECUTING...' : 'DISPATCH MAIL'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* TEMPLATE VAULT TABLE WITH DELETE */}
        <div className="glass-panel">
          <div className="panel-head">
            <h3 style={{margin:0}}>Template Vault</h3>
            <input 
              style={{padding: '6px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '12px'}} 
              placeholder="Filter blueprints..." 
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="panel-body" style={{padding: '0', maxHeight: '550px', overflowY: 'auto'}}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Blueprint</th>
                  <th>ID</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredTemplates.map(t => (
                  <tr key={t.id} className="tr-row" style={{cursor: 'pointer'}} onClick={() => setFormData({...formData, subject: t.subject, body: t.body, templateId: t.id})}>
                    <td style={{fontWeight: '700', color: '#1e293b'}}>
                        <div style={{display: 'flex', flexDirection: 'column'}}>
                            {t.templateName}
                            <span style={{fontSize: '10px', color: '#94a3b8', fontWeight: 'normal'}}>{t.fileName || 'No binary attached'}</span>
                        </div>
                    </td>
                    <td><span className="badge badge-blue">#{t.id}</span></td>
                    <td>
                        <button 
                            className="btn-action-del" 
                            onClick={(e) => handleDelete(e, t.id)}
                        >
                            TERMINATE
                        </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredTemplates.length === 0 && <div style={{padding: '40px', textAlign: 'center', color: '#94a3b8'}}>Vault empty or no matches.</div>}
          </div>
        </div>
      </div>

      {/* NOTIFICATION TOAST */}
      {status.msg && (
        <div style={{
          position: 'fixed', bottom: '30px', left: '50%', transform: 'translateX(-50%)',
          padding: '12px 30px', borderRadius: '50px', background: '#1e293b', color: 'white',
          fontSize: '13px', fontWeight: '700', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)',
          display: 'flex', alignItems: 'center', gap: '10px', zIndex: 1000
        }}>
          <span style={{color: status.type === 'success' ? '#10b981' : '#ef4444'}}>●</span>
          {status.msg}
        </div>
      )}
    </div>
  );
};

export default EmailHome;