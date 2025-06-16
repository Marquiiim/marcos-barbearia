import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { isBefore, isSameYear, getYear } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';
import ptBR from 'date-fns/locale/pt-BR';

function Agendar() {

    const [selectedDate, setSelectedDate] = useState(null)
    const [unavailableDates, setUnavailableDates] = useState([
        new Date(getYear(new Date()), 0, 1), // 1° de Janeiro
        new Date(getYear(new Date()), 11, 25) // 25 de Dezembro
    ])
    const [nome, setNome] = useState('')
    const currentYear = getYear(new Date())

    const isAvailable = (date) => {

        return (
            isSameYear(date, new Date()) &&
            !unavailableDates.some(d => d.getTime() === date.getTime()) &&
            !isBefore(date, new Date())
        )
    }

    const dayClassName = (date) => {
        return isAvailable(date) ? 'available-day' : 'unavailable-day'
    }

    return (
        <div>
            <section>
                <form>
                    <fieldset>
                        <legend>
                            Agendar um horário
                        </legend>

                        <input
                            type='text'
                            placeholder='Seu nome completo'
                            onChange={(e) => setNome(e.target.value)}
                        />

                        <DatePicker
                            selected={selectedDate}
                            onChange={(date) => setSelectedDate(date)}
                            locale={ptBR}
                            dateFormat="yyyy-MM-dd"
                            minDate={new Date()}
                            maxDate={new Date(currentYear, 11, 31)}
                            filterDate={isAvailable}
                            dayClassName={dayClassName}
                            inline
                            highlightDates={unavailableDates.map(date => ({
                                date,
                                className: 'highlight-unavailable'
                            }))}
                        />

                        <input
                            type="submit"
                            value='Agendar'
                            disabled={!selectedDate || !nome}
                        />
                    </fieldset>
                </form>
            </section>
        </div>
    )
}

export default Agendar