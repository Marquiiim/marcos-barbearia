import { useState, useEffect } from "react";
import axios from "axios";
import styles from '../../sass/pages/Agendar.module.css';

function Agendar() {
    const [nome, setNome] = useState('');
    const [corte, setCorte] = useState('');
    const [extra, setExtra] = useState('');
    const [data, setData] = useState('');
    const [hora, setHora] = useState('');
    const [dia, setDia] = useState('');

    const [agendamento, setAgendamento] = useState([])
    const [submitted, setSubmitted] = useState(false);
    const [diasDoMes, setDiasDoMes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAgendamentos = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/dados')
                setAgendamento(response.data)
            } catch (error) {
                console.error("Erro ao buscar agendamentos:", error)
            }
        }

        const daysMonth = () => {
            const dataAtual = new Date();
            const ano = dataAtual.getFullYear();
            const mes = dataAtual.getMonth();
            const ultimoDiaDoMes = new Date(ano, mes + 1, 0).getDate();
            const dias = Array.from({ length: ultimoDiaDoMes }, (_, i) => i + 1);
            setDiasDoMes(dias);
            setLoading(false);
        }

        fetchAgendamentos()
        daysMonth();
    }, []);

    const twoDigitFormat = (valor) => {
        return valor < 10 ? `0${valor}` : valor.toString();
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!data || !hora) {
            setSubmitted(false);
            return;
        }

        try {
            await axios.post('http://localhost:5000/api/dados', {
                nome,
                corte,
                extra: extra || "Sem extra",
                dia: data,
                horario: hora
            });
            setSubmitted(true);

            setNome('');
            setCorte('');
            setExtra('Sem extra');
            setData('');
            setHora('');
            setDia('');
        } catch (err) {
            console.error("Erro detalhado:", err.response?.data || err.message);
            setSubmitted(false)
        }
    }

    const horasDisponiveis = [
        "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
        "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
        "17:00", "17:30", "18:00"
    ];

    return (
        <div className={styles.container}>
            <section className={styles.content}>
                <form onSubmit={handleSubmit}>
                    <fieldset className={styles.formCard}>
                        <h2 className={styles.title_form}>Agendamento</h2>

                        <div className={styles.formGroup}>
                            <input
                                type="text"
                                name="nome"
                                placeholder="Nome completo"
                                className={styles.input}
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <select
                                name="corte"
                                className={styles.select}
                                value={corte}
                                onChange={(e) => setCorte(e.target.value)}
                                required
                            >
                                <option value=''>Selecione um corte</option>
                                <option value='Apenas Corte'>Apenas Corte</option>
                                <option value='Corte e Bigode'>Corte e Bigode</option>
                                <option value='Corte e Sobrancelha'>Corte e Sobrancelha</option>
                                <option value='Corte e Cavanhaque'>Corte e Cavanhaque</option>
                                <option value='Corte e Barba Completa'>Corte e Barba Completa</option>
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <select
                                name="extra"
                                className={styles.select}
                                value={extra}
                                onChange={(e) => setExtra(e.target.value)}
                                required
                            >
                                <option value='Sem extra'>Sem extra</option>
                                <option value='Pigmentação'>Pigmentação</option>
                                <option value='Limpeza Facial'>Limpeza Facial</option>
                                <option value='Acabamento'>Acabamento</option>
                            </select>
                        </div>

                        {submitted && dia === '' && (
                            <div className="alert alert-warning" role="alert">
                                Selecione um dia disponível
                            </div>
                        )}

                        <div className={styles.formGroup}>
                            <h3 className={styles.scheduleTitle}>Dias disponíveis</h3>
                            {loading ? (
                                <p>Carregando datas...</p>
                            ) : (
                                <div className={styles.gridContainer}>
                                    {diasDoMes.map(diaItem => {
                                        const dataAtual = new Date();
                                        const dataFormatada = `${dataAtual.getFullYear()}-${twoDigitFormat(dataAtual.getMonth() + 1)}-${twoDigitFormat(diaItem)}`;
                                        const isPastDay = diaItem < dataAtual.getDate() &&
                                            dataAtual.getMonth() === new Date().getMonth() &&
                                            dataAtual.getFullYear() === new Date().getFullYear();

                                        return (
                                            <button
                                                type="button"
                                                key={diaItem}
                                                className={`${styles.timeButton} ${dia === diaItem.toString() ? styles.active : isPastDay ? styles.indisponivel : ''}`}
                                                onClick={() => {
                                                    if (!isPastDay) {
                                                        setDia(diaItem.toString());
                                                        setData(dataFormatada);
                                                    }
                                                }}
                                                disabled={isPastDay}
                                            >
                                                {diaItem}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {submitted && hora === '' && (
                            <div className="alert alert-warning" role="alert">
                                Selecione uma hora disponível
                            </div>
                        )}

                        <div className={styles.formGroup}>
                            <h3 className={styles.scheduleTitle}>Horários disponíveis</h3>
                            <div className={styles.hoursGrid}>
                                {horasDisponiveis.map(horaItem => {
                                    const horarioOcupado = agendamento.some(item => item.horario.slice(0, 5) === horaItem && item.dia === data
                                    )

                                    return (
                                        <button
                                            type="button"
                                            key={horaItem}
                                            className={`${styles.timeButton} ${hora === horaItem ? styles.active : horarioOcupado ? styles.indisponivel : ''}`}
                                            onClick={() => !horarioOcupado && setHora(horaItem)}
                                            disabled={horarioOcupado || !data}
                                        >
                                            {horaItem}
                                        </button>)
                                })}
                            </div>
                        </div>

                        {submitted && (
                            <div className="alert alert-success" role="alert">
                                Dados enviados com sucesso!
                            </div>
                        )}

                        <button type="submit" className={styles.submitButton}>
                            Confirmar Agendamento
                        </button>
                    </fieldset>
                </form>
            </section>
        </div>
    );
}

export default Agendar;