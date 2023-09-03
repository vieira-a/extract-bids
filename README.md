# Extrator de Processos Licitatórios

## Contexto

Este projeto (apenas backend) tem como objetivo criar um banco de dados abrangente contendo informações sobre os processos licitatórios no Brasil. Um dos sistemas essenciais para essa integração é o [Portal de Compras Públicas](https://www.portaldecompraspublicas.com.br/processos). Os dois prints exibidos na seção de Telas deste documento executam solicitações (requests) que carregam os dados na interface do site, e esses dados serão extraídos para nosso banco de dados.

## Requisitos

1. **Utilização de Transações**: Todas as operações no banco de dados selecionado devem ser realizadas dentro de transações.

2. **Tecnologias Utilizadas**:
   - NestJS
   - TypeScript
   - MongoDB

3. **Modelo de Dados**:
   Utilizando o MongoDB optei por criar coleções separadas para os processos e itens de processos. Incluí em cada item de, o código da licitação, para garantir o relacionamento entre as coleções.

## Objetivo

O objetivo principal deste projeto é criar um sistema de extração automática de processos e itens licitatórios, com as seguintes funcionalidades:

1. **Extração Automática de Processos e Itens**:
   - 1.1. A extração deve ocorrer automaticamente quatro vezes por dia e deve incluir apenas os processos dos próximos 30 dias.
   - 1.2. Deve-se considerar as diferenças entre cada extração. Isso significa que, se houver extrações às 14h e às 18h, a segunda extração deve levar em conta os processos novos que foram cadastrados e atualizá-los se houver mudanças após a primeira extração, além de excluir os processos que não existem mais.

2. **Rota para Forçar Extração via Chamada HTTP**:
   - 2.1. Deve haver uma rota HTTP que permita forçar a extração de processos imediatamente quando chamada. Certifique-se de verificar se já não há uma extração em execução e não permitir extrações simultâneas.

3. **Rota de Busca de Processos Extraídos**:
   - 3.1. Deve existir uma rota de busca que permita consultar os processos extraídos. Essa rota deve retornar os itens do processo junto com a solicitação.
   - 3.2. A rota deve aceitar filtros, como data de início do processo, número do processo, uma busca textual no campo "resumo" e uma busca textual no campo "descrição do item".
   - 3.3. A rota deve suportar paginação.

## Campos Obrigatórios na Importação

### Campos Obrigatórios para a Importação de Processos:
- [Referência de API](https://compras.api.portaldecompraspublicas.com.br/v2/licitacao/processos?)
   - codigoLicitacao
   - identificacao
   - numero (número do processo)
   - resumo
   - codigoSituacaoEdital
   - status.codigo
   - dataHoraInicioLances (Data de início do processo)

### Campos Obrigatórios para a Importação de Itens do Processo:
- [Referência de API](https://compras.api.portaldecompraspublicas.com.br/v2/licitacao/252073/itens?filtro=&pagina=1)
   - quantidade
   - valorReferencia
   - descricao
   - participacao.codigo
   - codigo

## Instruções de Configuração

Para executar este projeto localmente, siga estas etapas:

1. **Clone o repositório:**
```
   git clone https://github.com/seu-usuario/seu-projeto.git
   cd seu-projeto

```

2. Crie um arquivo **.env** na raiz do projeto e defina as variáveis de ambiente necessárias:

```
   DB_HOST=127.0.0.1
   DB_PORT=27017
   DB_NAME=db_bidding
   MONGO_URI=mongodb://127.0.0.1:27017/db_bidding
```

3. Instale as dependências

Certifique-se de que você tem o Node.js e o npm instalados. Em seguida, execute o seguinte comando para instalar as dependências:

```
   npm install
```

4. Execute o Docker Compose para configurar o MongoDB:

```
   docker-compose up
```
Isso iniciará uma instância do MongoDB com as configurações especificadas em **mongodb-init.js**, que está na raiz do projeto.

5. Execute a aplicação

```
   npm start:dev
```

Agora, a aplicação deve estar em execução localmente e conectada à instância do MongoDB configurada. Você pode acessá-la em http://localhost:3000 no seu navegador.

## Funcionalidades

### ExtractController

O controlador **ExtractController** lida com a extração de dados de processos de licitação de uma API externa e os armazena em um banco de dados MongoDB. 

Este controlador é responsável por controlar o processo de extração de dados de processos de licitação e garantir que apenas uma extração ocorra de cada vez para evitar problemas de concorrência.

Rota existente:

```
   GET /extract
```

- Descrição: esta rota inicia o processo de extração de dados de processos de licitação.
- Fluxo de Funcionamento:
   1. Verifica se uma extração de processos já está em andamento no momento. Se estiver, retorna uma mensagem informando que a extração já está em execução. Caso contrário, bloqueia a extração para evitar que várias extrações ocorram simultaneamente.
   2. Define um intervalo de datas a serem usadas na consulta à API externa, neste caso, de hoje até dois dias no futuro.
   3. Constrói a URL da API externa com base no intervalo de datas e em outras configurações.
   4. Inicia um loop que consulta páginas de dados da API externa até que não haja mais dados a serem extraídos.
   5. A cada iteração, realiza uma solicitação à API externa usando a instância do extractBiddingApiRepository para extrair os dados da página atual.
   5. Se não houver mais dados a serem extraídos, o loop é encerrado.
   6. Os dados extraídos de todas as páginas são consolidados em allExtractedDataBids.
   7. Após a extração bem-sucedida, o bloqueio de extração é liberado.
   
- Resposta:
   1. Em caso de sucesso, retorna uma mensagem informando que a extração foi concluída com sucesso.
   2. Em caso de erro durante a extração, retorna uma mensagem de erro.

### ExtractItemsController

O ExtractItemsController é responsável por extrair dados de itens de processos de licitação de uma API externa e salvá-los em um banco de dados MongoDB. 

Este controlador é responsável por controlar o processo de extração de dados de itens de processos de licitação, iterando sobre os códigos dos processos existentes e salvando os itens correspondentes no banco de dados. Ele também garante que apenas uma extração ocorra de cada vez para evitar problemas de concorrência.

Rota existente:

```
   GET /extract/items
```

- Descrição: Esta rota inicia o processo de extração de dados de itens de processos de licitação.

- Fluxo de Funcionamento:
   1. Verifica se uma extração de itens de processos já está em andamento no momento. Se estiver, retorna uma mensagem informando que a extração já está em execução. Caso contrário, bloqueia a extração para evitar que várias extrações ocorram simultaneamente.
   2. Obtém uma lista de códigos de processos de licitação armazenados no banco de dados MongoDB usando getAllProcessCodes.
   3. Itera sobre cada código de processo e constrói a URL da API externa para extrair os itens específicos desse processo.
   4. Para cada processo, solicita à API externa os dados dos itens usando a instância de extractBiddingItemsApiRepository e os parâmetros apropriados.
   5. Itera sobre os itens extraídos e os salva no banco de dados MongoDB usando saveProcessItems.
   6. Registra as informações de extração na saída do console.
   7. Após a extração bem-sucedida de todos os processos, o bloqueio de extração é liberado.

- Resposta:

   1. Em caso de sucesso, retorna uma mensagem informando que a extração foi concluída com sucesso.
   2. Em caso de erro durante a extração, retorna uma mensagem de erro.

### ProcessesController

Este controlador ProcessesController é responsável por lidar com a obtenção de processos de licitação a partir do banco de dados, com a possibilidade de aplicar filtros às consultas. 

Este controlador fornece uma interface para buscar e filtrar processos de licitação com base em vários critérios e é útil para consultar e exibir esses processos em sua aplicação.

Rotas existente:

```
   GET /processes
```

- Descrição: Esta rota permite a busca de processos de licitação com opções de paginação e filtros.

- Parâmetros de Consulta (Query Parameters):
   - page (padrão: 1): Número da página a ser exibida.
   - limit (padrão: 10): Número máximo de resultados por página.
   - inicio: Data de início dos lances.
   - numero: Número do processo de licitação.
   - resumo: Termo de busca para o resumo do processo.
   - itemDescricao: Termo de busca para a descrição dos itens do processo.

- Fluxo de Funcionamento:

   1. Valida e aplica os parâmetros de consulta, como page e limit, usando o pacote @nestjs/common.
   2. Constrói um objeto filters que será usado para filtrar os resultados da consulta.
   3. Se inicio estiver presente, adiciona um filtro para buscar processos com dataHoraInicioLances maior ou igual à data especificada.
   4. Se numero estiver presente, adiciona um filtro para buscar processos com um número correspondente.
   5. Se resumo estiver presente, adiciona um filtro de pesquisa para buscar processos com resumos correspondentes (case-insensitive).
   6. Se itemDescricao estiver presente, adiciona um filtro de pesquisa para buscar processos com descrições de itens correspondentes (case-insensitive).
   7. Obtém uma lista de processos de licitação que correspondem aos filtros e à paginação usando getAllProcesses do mongoDbHelper.
   8. Retorna a lista de processos de licitação encontrados, juntamente com informações de paginação, se aplicável.

- Resposta:
   1. Em caso de sucesso, retorna um objeto contendo a lista de processos de licitação, informações de página e limit, se houverem resultados. Caso contrário, retorna uma mensagem indicando que nenhum processo foi encontrado.
   2. Em caso de erro durante a consulta, retorna uma mensagem de erro.

# Clean Architecture e Princípios SOLID no projeto

Este projeto foi desenvolvido seguindo os princípios da Clean Architecture e os princípios SOLID, que promovem a organização, a manutenibilidade e a escalabilidade do código.

Feito por [Anderson Vieira](https://linkedin/in/vieira-a) como proposta de resolução para um teste técnico.
