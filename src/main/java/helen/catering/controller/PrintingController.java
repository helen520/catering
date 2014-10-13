package helen.catering.controller;

import helen.catering.model.entities.PosPrinter;
import helen.catering.model.entities.PrintPacket;
import helen.catering.service.DishOrderPrintingService;
import helen.catering.service.ServiceException;
import helen.catering.service.StoreDataService;
import helen.catering.service.printing.PrintingServer;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("printing")
public class PrintingController {

	@Autowired
	PrintingServer _printingServer;

	@Autowired
	StoreDataService _storeDataService;

	@Autowired
	DishOrderPrintingService _dishOrderPrintingService;

	@RequestMapping(value = "testPrinter")
	public @ResponseBody
	boolean testPrinter(@RequestParam long printerId) {
		try {
			return _dishOrderPrintingService.testingPosPrinter(printerId);
		} catch (Exception e) {
			return false;
		}
	}

	@RequestMapping(value = "/state/{printerId}", method = RequestMethod.GET)
	public @ResponseBody
	int state(@PathVariable long printerId) {
		return _printingServer.getPrinterState(printerId);
	}

	@RequestMapping(value = "/printerQueueLength/{printerId}", method = RequestMethod.GET)
	public @ResponseBody
	int printerQueueLength(@PathVariable long printerId) {
		return _printingServer.getPrinterQueueLength(printerId);
	}

	@RequestMapping(value = "/emptyPrinterQueue/{printerId}", method = RequestMethod.GET)
	public @ResponseBody
	int emptyPrinterQueue(@PathVariable long printerId) {
		return _printingServer.emptyPrinterQueue(printerId);
	}

	@RequestMapping(value = "/count", method = RequestMethod.GET)
	public @ResponseBody
	int count() {
		return _printingServer.getPrinterCount();
	}

	@RequestMapping(value = "/realtimeState/{printerId}", method = RequestMethod.GET)
	public @ResponseBody
	boolean realtimeState(@PathVariable long printerId) {
		return _printingServer.isPrinterReady(printerId);
	}

	@RequestMapping(value = "/printer/{printerId}", method = RequestMethod.GET)
	public @ResponseBody
	PosPrinter printer(@PathVariable long printerId) {
		return _printingServer.getPrinter(printerId);
	}

	@RequestMapping(value = "/getPrintPacket/{storeId}", method = RequestMethod.GET)
	public @ResponseBody
	List<PrintPacket> getPrintPacket(@PathVariable long storeId,
			@RequestParam String printerIdString, @RequestParam String appKey,
			@RequestParam String appSecret) throws ServiceException {
		if (!auth(appKey, appSecret))
			throw new ServiceException("not autherized!");
		long[] printerIds = _dishOrderPrintingService
				.getPrinterIdsByStoreId(storeId);
		List<Long> printerIdList = new ArrayList<Long>();
		printerIdString = "," + printerIdString + ",";
		for (long printerId : printerIds)
			if (printerIdString.contains("," + printerId + ","))
				printerIdList.add(printerId);

		return _printingServer.getPrintPacket(printerIdList);
	}

	private boolean auth(String appKey, String appSecret) {
		return "cateringClient".equals(appKey) && "!QA2ws#ED".equals(appSecret);
	}

	@ResponseBody
	@RequestMapping("getCNPrintersByStoreId/{storeId}")
	public List<PosPrinter> getCNPrintersByStoreId(@PathVariable long storeId) {
		List<PosPrinter> cnPrinterList = new ArrayList<PosPrinter>();
		List<PosPrinter> cnPrinters = _storeDataService
				.getCNPrintersByStoreId(storeId);

		for (PosPrinter posPrinter : cnPrinters) {
			int state = _printingServer.getPrinterState(posPrinter.getId());
			if (state == 1) {
				cnPrinterList.add(posPrinter);
			}
		}
		return cnPrinters;
	}
}
