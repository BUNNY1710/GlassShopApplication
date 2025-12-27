package com.glassshop.ai.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.glassshop.ai.dto.StockActivityDto;
import com.glassshop.ai.dto.StockUpdateRequest;
import com.glassshop.ai.entity.Stock;
import com.glassshop.ai.service.AiExplanationService;
import com.glassshop.ai.service.AlertService;
import com.glassshop.ai.service.ReorderService;
import com.glassshop.ai.service.StockService;

@RestController
@RequestMapping("/stock")
@CrossOrigin(origins = "http://localhost:3000")
public class StockController {
	
	 	@Autowired
	    private StockService stockService;
	 	
	 	@Autowired
	 	private AlertService alertService;
	 	
	 	@Autowired
	 	private ReorderService reorderService;
	 	
	 	@Autowired
	 	private AiExplanationService aiExplanationService;

	 	@GetMapping("/ai/explain")
	 	public String aiExplanation() {
	 	    return aiExplanationService.explainLowStock();
	 	}

	 	@GetMapping("/reorder/suggest")
	 	public String reorderSuggestion() {
	 	    return reorderService.getReorderSuggestions();
	 	}

	 	@GetMapping("/alert/low")
	 	public String lowStockAlert() {
	 	    return alertService.checkLowStockOnly();
	 	}

	    @PostMapping("/update")
	    public String updateStock(
	            @RequestBody StockUpdateRequest request) {
	        return stockService.updateStock(request);
	    }
	    
	    @GetMapping("/all")
	    public List<Stock> getAllStock() {
	        return stockService.getAllStock();
	    }
	    
	    @PostMapping("/undo")
	    public String undoLastAction() {
	        return stockService.undoLastAction();
	    }

	 // StockController.java
	    @GetMapping("/recent")
	    public List<StockActivityDto> recentStockActivity() {
	        return stockService.getRecentStockActivity(3);
	    }



}
