function [P_vap] = Pvap(T,press_sat)
%Written by Jacob Backhaus
%T [K] 
%press_sat [Antoine Coefficients] calculates P_vap [kPa] using Antoine equation

%P_vap vapor pressure of each component

%Looks up coefficients needed to calculate the saturation pressure
A=press_sat(:, 1);
B=press_sat(:, 2);
C=press_sat(:, 3);

%Saturation pressure calculation pressure in kPa

P_vap=(1/7.5)*10.^(A-B./((T-273.15)+C));

end

