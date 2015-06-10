function [f1] = f(L,x,mixture_params,Unifac_GC,P_tot)
%Written by Jacob Backhaus
%State function for calculating coupled ODE for distillation

%Inputs
% L - The fraction of the total moles of liquid remaining
% x(1:end-1) - liquid mole fractions of each component
% x(end) - guess temperature calculated by assuming a constant step size
% the guess for the step size has been tunes to 

if nargin==4
    P_tot=101.3;
end

groups=mixture_params{10};

T_g=x(end);

[T,gamma,P_vap]=Temp(x(1:length(groups)),T_g,mixture_params,Unifac_GC,P_tot);    %calculated temperature from guess temp
K=(P_vap.*gamma)./P_tot; %equilibrium ratio
f1(1:length(groups))=x(1:length(groups)).*((K(1:length(groups))-1)./L);   %dx/dL
%guess for dT/dL to get resonable guess values for the temperature profile and the temperature at the next step
f1(length(x))=-(T-x(end))/.005; 
f1=f1.';

end

