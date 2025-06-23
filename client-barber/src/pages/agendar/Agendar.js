import { useState, useEffect } from "react";
import axios from "axios";

import styles from '../../sass/pages/Agendar.module.css';

function Agendar() {
    const [nome, setNome] = useState(''); // SETADO
    const [corte, setCorte] = useState(''); // SETADO
    const [extra, setExtra] = useState(''); // SETADO
    const [data, setData] = useState('') // SETADO
    const [hora, setHora] = useState('');  // SETADO

    const [dia, setDia] = useState('');
    const [submitted, setSubmitted] = useState(false)
    const [diasDoMes, setDiasDoMes] = useState([]);

    const [dadosDate, setDadosDate] = useState([])

    useEffect(() => {
        const dataAtual = new Date();
        const ano = dataAtual.getFullYear();
        const mes = dataAtual.getMonth();

        const ultimoDiaDoMes = new Date(ano, mes + 1, 0).getDate();
        const dias = Array.from({ length: ultimoDiaDoMes }, (_, i) => i + 1);
        setDiasDoMes(dias);
    }, []);

    const handleSubmit = async (e) => {
        try {
            const response = await axios.post('http://127.0.1/api/dados', {
                columns: [data]
            })
            setDadosDate(response.data)
            setSubmitted(true)
        } catch (err) {
            console.error("Erro ao enviar:", err)
        }

    }

    const convertToDate = (key) => {
        setDia(key.toString())

        const formatoDoisDigitos = (valor) => {
            return valor < 10 ? `0${valor}` : valor.toString()
        }

        const dataAtual = new Date()
        const diaFormatado = formatoDoisDigitos(key)
        const mesFormatado = formatoDoisDigitos(dataAtual.getMonth() + 1)
        const ano = dataAtual.getFullYear()

        const dataMySQL = `${ano}-${mesFormatado}-${diaFormatado}`
        setData(dataMySQL)
    }

    const horasDisponiveis = [
        "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
        "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
        "17:00", "17:30", "18:00"
    ];



    return (
        <div className={styles.container}>
            <section className={styles.content}>
                <form onSubmit={async (e) => {
                    e.preventDefault()
                    await handleSubmit(e)
                }}>
                    <fieldset className={styles.formCard}>
                        <h2 className={styles.title_form}>
                            Agendamento
                        </h2>

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
                                <option value='Corte, Barba Completa'>Corte, Barba Completa</option>
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
                            <div className={styles.gridContainer}>
                                {diasDoMes.map(diaItem => (
                                    <button
                                        type="button"
                                        name="data"
                                        key={diaItem}
                                        className={`${styles.timeButton} ${dia === diaItem.toString() ? styles.active : ''}`}
                                        onClick={() => convertToDate(diaItem)}
                                    >
                                        {diaItem}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {submitted && hora === '' && (
                            <div className="alert alert-warning" role="alert">
                                Selecione uma hora disponível
                            </div>
                        )}

                        <div className={styles.formGroup}>
                            <h3 className={styles.scheduleTitle}>Horários disponíveis</h3>
                            <div className={styles.hoursGrid}>
                                {horasDisponiveis.map(horaItem => (
                                    <button
                                        type="button"
                                        name="hora"
                                        key={horaItem}
                                        className={`${styles.timeButton} ${hora === horaItem.toString() ? styles.active : ''}`}
                                        onClick={() => setHora(horaItem)}
                                    >
                                        {horaItem}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {!submitted && <div class="alert alert-success" role="alert">
                            Dados enviados com sucesso!
                        </div>}

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