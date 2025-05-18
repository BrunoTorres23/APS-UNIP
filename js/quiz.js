document.addEventListener('DOMContentLoaded', function () {
    // Elementos do DOM
    const btnStartQuiz = document.getElementById('btnStartQuiz');
    const quizSection = document.getElementById('quiz-section');
    const quizDescription = document.getElementById('quiz-description');
    const quizContainer = document.getElementById('quiz-container');
    const questionContainer = document.getElementById('question-container');
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const btnNext = document.getElementById('btn-next');
    const resultsContainer = document.getElementById('results-container');
    const scoreDisplay = document.getElementById('score-display');
    const feedbackText = document.getElementById('feedback-text');
    const btnRestart = document.getElementById('btn-restart');

    // Perguntas do quiz
    const questions = [
        {
            question: "1. Qual destas práticas é mais sustentável ao lidar com equipamentos eletrônicos antigos?",
            options: [
                "A) Jogá-los no lixo comum",
                "B) Guardá-los em casa indefinidamente",
                "C) Doá-los para escolas públicas",
                "D) Levá-los a pontos de coleta de lixo eletrônico"
            ],
            correctAnswer: 3
        },
        {
            question: "2. Qual alternativa abaixo representa o uso de uma tecnologia verde?",
            options: [
                "A) Uso de servidores em datacenters com refrigeração a diesel",
                "B) Impressão em papel reciclado, mas com tinta não ecológica",
                "C) Energia solar para alimentar residências e empresas",
                "D) Compra frequente de aparelhos eletrônicos mais modernos"
            ],
            correctAnswer: 2
        },
        {
            question: "3. Um site que promove a sustentabilidade deve ter qual destas características?",
            options: [
                "A) Imagens pesadas e vídeos automáticos",
                "B) Incentivo ao consumo de produtos tecnológicos",
                "C) Conteúdo educativo e acessível a todos",
                "D) Publicidade voltada para novos gadgets"
            ],
            correctAnswer: 2
        },
        {
            question: "4. Qual é o impacto positivo da digitalização de processos (como boletos, contratos e relatórios)?",
            options: [
                "A) Diminuição do tempo de leitura",
                "B) Aumento da burocracia",
                "C) Redução do uso de papel e transporte físico",
                "D) Consumo maior de energia elétrica"
            ],
            correctAnswer: 2
        },
        {
            question: "5. Como os aplicativos podem ajudar na sustentabilidade?",
            options: [
                "A) Incentivando o descarte acelerado de produtos",
                "B) Coletando dados pessoais para venda",
                "C) Oferecendo dicas de consumo consciente e rastreio de carbono",
                "D) Estimulando compras compulsivas em lojas online"
            ],
            correctAnswer: 2
        }
    ];

    // Variáveis de estado
    let currentQuestionIndex = 0;
    let score = 0;
    let selectedOption = null;

    // Iniciar o quiz
    btnStartQuiz.addEventListener('click', function () {
        btnStartQuiz.style.display = 'none';
        quizDescription.style.display = 'none';
        quizContainer.style.display = 'block';
        showQuestion(currentQuestionIndex);
    });

    // Mostrar a pergunta atual
    function showQuestion(index) {
        const question = questions[index];
        questionText.textContent = question.question;

        // Limpar opções anteriores
        optionsContainer.innerHTML = '';

        // Criar as opções
        question.options.forEach((option, i) => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'option p-3 mb-2 rounded';
            optionDiv.textContent = option;
            optionDiv.dataset.index = i;

            optionDiv.addEventListener('click', function () {
                // Remover seleção anterior
                document.querySelectorAll('.option').forEach(opt => {
                    opt.classList.remove('selected');
                    opt.classList.remove('correct');
                    opt.classList.remove('incorrect');
                });

                // Selecionar esta opção
                this.classList.add('selected');
                selectedOption = i;

                // Mostrar botão de próxima pergunta
                btnNext.style.display = 'block';
            });

            optionsContainer.appendChild(optionDiv);
        });

        // Esconder botão de próxima pergunta até que uma opção seja selecionada
        btnNext.style.display = 'none';
    }

    // Verificar resposta e passar para a próxima pergunta
    btnNext.addEventListener('click', function () {
        if (selectedOption === null) return;

        // Verificar se a resposta está correta
        const correctIndex = questions[currentQuestionIndex].correctAnswer;

        if (selectedOption === correctIndex) {
            score++;
            document.querySelectorAll('.option')[selectedOption].classList.add('correct');
        } else {
            document.querySelectorAll('.option')[selectedOption].classList.add('incorrect');
            document.querySelectorAll('.option')[correctIndex].classList.add('correct');
        }

        // Desabilitar cliques nas opções
        document.querySelectorAll('.option').forEach(opt => {
            opt.style.pointerEvents = 'none';
        });

        // Aguardar um momento para mostrar a próxima pergunta
        setTimeout(() => {
            currentQuestionIndex++;
            selectedOption = null;

            if (currentQuestionIndex < questions.length) {
                showQuestion(currentQuestionIndex);
            } else {
                showResults();
            }
        }, 1500);
    });

    // Mostrar resultados
    function showResults() {
        questionContainer.style.display = 'none';
        btnNext.style.display = 'none';
        resultsContainer.style.display = 'block';

        scoreDisplay.textContent = `Você acertou ${score} de ${questions.length} questões!`;

        // Feedback baseado na pontuação
        if (score === questions.length) {
            feedbackText.innerHTML = '<strong>Você é um verdadeiro agente da sustentabilidade! 🌱</strong><br>Continue compartilhando seu conhecimento e inspirando outros a adotarem práticas sustentáveis.';
        } else if (score >= 3) {
            feedbackText.innerHTML = '<strong>Muito bem! Está no caminho certo. 💡</strong><br>Continue se informando e aprimorando suas práticas sustentáveis.';
        } else if (score >= 1) {
            feedbackText.innerHTML = '<strong>Ainda há espaço para crescer! 📘</strong><br>Que tal explorar mais sobre o tema? Confira os recursos educativos disponíveis nesta página.';
        } else {
            feedbackText.innerHTML = '<strong>Não desanime! 🚀</strong><br>A sustentabilidade começa com o conhecimento. Vamos juntos nessa jornada!';
        }
    }

    // Reiniciar o quiz
    btnRestart.addEventListener('click', function () {
        currentQuestionIndex = 0;
        score = 0;
        selectedOption = null;

        questionContainer.style.display = 'block';
        resultsContainer.style.display = 'none';

        showQuestion(currentQuestionIndex);
    });

    // Adicionar estilos CSS inline para as opções
    const style = document.createElement('style');
    style.textContent = `
        .option {
            cursor: pointer;
            background-color: var(--card-bg);
            border: 1px solid var(--border-color);
            transition: all 0.3s ease;
        }
        
        .option:hover {
            background-color: var(--light-bg);
        }
        
        .option.selected {
            border-color: var(--primary-color);
            background-color: rgba(var(--primary-rgb), 0.1);
        }
        
        .option.correct {
            background-color: rgba(25, 135, 84, 0.2);
            border-color: #198754;
        }
        
        .option.incorrect {
            background-color: rgba(220, 53, 69, 0.2);
            border-color: #dc3545;
        }
        
        [data-theme="dark"] .option {
            background-color: var(--card-bg);
        }
        
        [data-theme="dark"] .option:hover {
            background-color: var(--dark-bg);
        }
        
        [data-theme="dark"] .option.selected {
            background-color: rgba(var(--primary-rgb), 0.3);
        }
        
        [data-theme="dark"] .option.correct {
            background-color: rgba(25, 135, 84, 0.3);
        }
        
        [data-theme="dark"] .option.incorrect {
            background-color: rgba(220, 53, 69, 0.3);
        }
    `;
    document.head.appendChild(style);
});
