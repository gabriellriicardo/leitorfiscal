<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_FILES['xmlfile'])) {
    if ($_FILES['xmlfile']['error'] === UPLOAD_ERR_OK) {
        $fileTmpPath = $_FILES['xmlfile']['tmp_name'];
        $xml = simplexml_load_file($fileTmpPath);

        if ($xml) {
            $emitente = (string) $xml->NFe->infNFe->emit->xNome;
            $dataEmissao = (string) $xml->NFe->infNFe->ide->dhEmi;
            
            $produtos = [];
            foreach ($xml->NFe->infNFe->det as $produto) {
                $item = [
                    'nome' => (string) $produto->prod->xProd,
                    'codigo_barras' => (string) $produto->prod->cEAN,
                    'quantidade' => (float) $produto->prod->qCom,
                    'preco' => (float) $produto->prod->vProd
                ];
                $produtos[] = $item;
            }
            
            $response = [
                'emitente' => $emitente,
                'dataEmissao' => $dataEmissao,
                'produtos' => $produtos
            ];
            
            echo json_encode($response);
        } else {
            echo json_encode(['error' => 'Erro ao processar o arquivo XML.']);
        }
    } else {
        echo json_encode(['error' => 'Erro no upload do arquivo.']);
    }
}
?>
