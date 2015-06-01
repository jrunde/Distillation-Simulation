function [T_dist,x_dist] = distillation(x0,mixture_params,GCVOL_GC,Unifac_GC,P_tot)
%Written by Jacob Backhaus
%distillation calculates an open batch distillation.  The output is a
%Temperature vector which corresponds to a volume percent recovered where
%recovered = [0,5,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95,99.5]

%x0 - initial concentration of each component
%mixture_params - all necessary information of the mixture to perform group
%contribution methods and perform calculations
%GCVOL_GC - Group contribution info for calculating density
%Unifac_GC - Group contribution info for calculating activity coefficients
%P_tot - total pressure

%output
% T_dist - Distillation temperature [K] in terms of volume fraction
% distilled
% x_dist - liquid mole fractions of each component as the distillation
% takes place

if nargin==4
    P_tot=101.3;
end

press_sat=mixture_params{3};    %antoine coefficient info
C_atoms=mixture_params{5};
H_atoms=mixture_params{6};
O_atoms=mixture_params{7};

%molecular weight of each component in the mixture
MW=C_atoms.*12+H_atoms.*1+O_atoms.*16; 

%array of L values for when component concentrations will be recorded.
L_array=[1;.95;.9;.85;.8;.75;.7;.65;.6;.55;.5;.45;.4;.35;.3;.25;.2;.15;.1;.05;.005];

%Correlation that was found to work well for estimating the initial boiling
%point of the given mixture.  Saves time.
T_b_guessvariable=sum(Pvap(311,press_sat).*x0.*UNIFAC(311,x0,mixture_params,Unifac_GC));
T_g=-27.77*log(T_b_guessvariable)+436.9;
x0(length(x0)+1)=T_g;   %the temperature is included as a variable of the state 
                        %function so that there are good guess values for
                        %the temperature after the ode has been solved.

options=odeset('RelTol',1e-3,'AbsTol',1e-6);
%solving of ode with new initial mole fractions.
[L,x_dist]=ode23(@(L,x) f(L,x,mixture_params,Unifac_GC,P_tot),L_array,x0,options);
T_test=x_dist(:,length(x0)); %guess temperature from the ODE output
x_dist=x_dist(:,1:length(x0)-1); %actual distillation concentrations
x_dist=x_dist.';
%use relative component concentrations to calculate temperature
T_dist=zeros(length(L),1);
V=zeros(length(L),1);

for i=1:size(x_dist,2);
    T_g = T_test(i); 
    T_dist(i)=Temp(x_dist(:,i),T_g,mixture_params,Unifac_GC,P_tot); %calculated temperature
    rho=density(T_dist(i),mixture_params,GCVOL_GC);
    %use density to change from mole fraction distilled to volume fraction distilled
    V(i)=sum(L(i)*x_dist(:,i).*MW./rho); 
end
       
V=V/max(V);
recovery=(1-V)*100;
recovery2=(1-L)*100;
T_dist=interp1(recovery,T_dist,recovery2,'linear','extrap');
T_dist=T_dist;

end   



