package com.glassshop.ai.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.glassshop.ai.entity.Stock;
import com.glassshop.ai.repository.StockRepository;

@Service
public class AlertService {

    @Autowired
    private StockRepository stockRepository;

    // 🔴 No mail sender for now
    public String checkLowStockOnly() {

        List<Stock> lowStocks = stockRepository.findLowStock();

        if (lowStocks.isEmpty()) {
            return "✅ All glass stock levels are healthy.";
        }

        StringBuilder alertMsg = new StringBuilder("⚠ LOW STOCK ALERT\n\n");

        for (Stock s : lowStocks) {
            if (s.getGlass() == null) continue;

            alertMsg.append("Glass: ")
                    .append(s.getGlass().getType())
                    .append("\nStand: ")
                    .append(s.getStandNo())
                    .append("\nAvailable: ")
                    .append(s.getQuantity())
                    .append("\nMinimum: ")
                    .append(s.getMinQuantity())
                    .append("\n\n");
        }

        return alertMsg.toString();
    }
}
