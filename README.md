# Tecnologia Verde e Inovação Sustentável

Projeto desenvolvido para a APS (Atividade Prática Supervisionada) do 1° Semestre do curso de Ciência da Computação da UNIP.

## Sobre o Projeto

Este projeto é um website informativo sobre tecnologias sustentáveis e inovações ambientais, focado em cinco áreas principais:

- Dispositivos Sustentáveis
- Aplicativos Verdes
- Monitoramento Ambiental
- Energias Renováveis
- Cidades Inteligentes

## Tecnologias Utilizadas

- HTML5
- CSS3
- JavaScript
- Bootstrap 5.3.3
- Bootstrap Icons

## Estrutura do Projeto

```
.
├── browser-testing/     # Ferramentas e documentação para testes cross-browser
├── css/
│   ├── style.css       # Estilos principais
│   └── browser-fixes.css # Correções específicas para navegadores
├── js/
│   ├── main.js         # Ponto de entrada principal
│   ├── bundle.js       # Bundle para navegadores legados
│   ├── browser-compatibility.js # Script de detecção de compatibilidade
│   ├── script.js       # Scripts gerais
│   └── modules/        # Módulos JavaScript
├── images/
├── index.html
├── paginas/           # Páginas do site
└── service-worker.js  # Service worker para funcionalidade offline
```

## Características

- Design responsivo
- Interface moderna e intuitiva
- Navegação por sidebar
- Seções informativas
- Estatísticas e dados visuais
- Casos de sucesso
- Foco em sustentabilidade
- Compatibilidade cross-browser
- Progressive enhancement
- Otimização de performance

## Como Executar

1. Clone o repositório
2. Abra o arquivo `index.html` em um navegador web
3. Navegue pelas diferentes seções usando o menu lateral

## Testes Cross-Browser

O projeto inclui ferramentas para testes de compatibilidade entre navegadores:

### Detecção Automática de Recursos

1. Adicione `?browser-test=true` à URL de qualquer página (ex: `index.html?browser-test=true`)
2. Um painel de teste aparecerá no canto inferior direito
3. Clique em "Run All Tests" para verificar o suporte de recursos do navegador
4. Clique em "Export Results" para baixar os resultados

### Testes Manuais

1. Adicione `?manual-test=true` à URL de qualquer página (ex: `index.html?manual-test=true`)
2. Um painel de teste aparecerá no lado direito da tela
3. Preencha as informações do navegador (devem ser detectadas automaticamente)
4. Marque cada item de teste como Aprovado ou Reprovado
5. Clique em "Export Test Results" para baixar um relatório

Para mais informações sobre testes cross-browser, consulte a documentação em `browser-testing/README.md`.

## Contribuição

Este é um projeto acadêmico desenvolvido em grupo. Para contribuições, entre em contato com os desenvolvedores.

## Licença

Este projeto está sob a licença MIT.
