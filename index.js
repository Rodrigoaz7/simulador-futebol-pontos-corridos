const { json } = require('body-parser');
const app = require('./config/app');
const controller = require('./src/controller/buscarDadosSimulacao');

app.get('/', async function(req,res) {
	const times = await controller.obterTimes();
	const rodadas = await controller.obterRodadas();

	res.render("brasileiroA2021", 
	{
		rodadaAtual: 1,
		times: times,
		rodadas: rodadas
	});
});

app.listen(3000 , () => {
	console.log("API RUNNING AT PORT 3000")
})